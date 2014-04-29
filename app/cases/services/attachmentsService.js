'use strict';

angular.module('RedhatAccess.cases')
  .service('AttachmentsService', [
    '$filter',
    '$q',
    'strataService',
    'TreeViewSelectorUtils',
    '$http',
    'securityService',
    'AlertService',
    function ($filter, $q, strataService, TreeViewSelectorUtils, $http, securityService, AlertService) {
      this.originalAttachments = [];
      this.updatedAttachments = [];

      this.backendAttachments = [];

      this.clear = function () {
        this.originalAttachments = [];
        this.updatedAttachments = [];
        this.backendAttachments = [];
      };

      this.updateBackEndAttachements = function (selected) {
        this.backendAttachments = selected;
      };

      this.hasBackEndSelections = function () {
        return TreeViewSelectorUtils.hasSelections(this.backendAttachments);
      };

      this.removeAttachment = function ($index) {
        this.updatedAttachments.splice($index, 1);
      };

      this.getOriginalAttachments = function () {
        return this.originalAttachments;
      };

      this.getUpdatedAttachments = function () {
        return this.updatedAttachments;
      };

      this.addNewAttachment = function (attachment) {
        this.updatedAttachments.push(attachment);
      };

      this.defineOriginalAttachments = function (attachments) {
        if (!angular.isArray(attachments)) {
          this.originalAttachments = [];
        } else {
          this.originalAttachments = attachments;
        }

        this.updatedAttachments = angular.copy(this.originalAttachments);
      };


      this.postBackEndAttachments = function (caseId) {
        var selectedFiles = TreeViewSelectorUtils.getSelectedLeaves(this.backendAttachments);
        return securityService.getBasicAuthToken().then(
          function (auth) {
            //we post each attachment separately
            var promises = [];
            angular.forEach(selectedFiles, function (file) {
              var jsonData = {
                authToken: auth,
                attachment: file,
                caseNum: caseId
              };
              var deferred = $q.defer();
              $http.post('attachments', jsonData).success(function (data) {
                deferred.resolve(data);
                AlertService.addSuccessMessage(
                  'Successfully uploaded attachment ' +
                  jsonData.attachment + ' to case ' + caseId);
              }).error(function (error) {
                 AlertService.addSuccessMessage(
                  'Failed to upload attachment ' +
                  jsonData.attachment + ' to case ' + caseId);
                deferred.reject();
              });
              promises.push(deferred.promise);
            });
            return $q.all(promises);
          });
      };

      this.updateAttachments = function (caseId) {
        var hasLocalAttachments = !angular.equals(this.originalAttachments, this.updatedAttachments);
        var hasServerAttachments = this.hasBackEndSelections;
        if (hasLocalAttachments || hasServerAttachments) {
          var promises = [];
          var updatedAttachments = this.updatedAttachments;
          if (hasServerAttachments) {
            promises.push(this.postBackEndAttachments(caseId));
          }
          if (hasLocalAttachments) {
            //find new attachments
            for (var i in updatedAttachments) {
              if (!updatedAttachments[i].hasOwnProperty('uuid')) {
                var promise = strataService.cases.attachments.post(
                  updatedAttachments[i].file,
                  caseId
                )
                promise.then(
                    function (uri) {
                      updatedAttachments[i].uri = uri;
                      //TODO: delete uploading message
                      AlertService.addSuccessMessage(
                          'Successfully uploaded attachment ' +
                              updatedAttachments[i].name + ' to case ' + caseId);
                    },
                    function(error) {
                      AlertService.addStrataErrorMessage(error);
                    }
                );
                promises.push(promise);
              }
            }
            //find removed attachments
            jQuery.grep(this.originalAttachments, function (origAttachment) {
              var attachment =
                $filter('filter')(updatedAttachments, {
                  'uuid': origAttachment.uuid
                });

              if (attachment.length == 0) {
                var promise = strataService.cases.attachments.delete(
                    origAttachment.uuid,
                    caseId)

                promise.then(
                    function() {
                      AlertService.addSuccessMessage('Deleted attachment: ' +  origAttachment.uuid)
                    },
                    function(error) {
                      AlertService.addStrataErrorMessage(error);
                    }
                )

                promises.push(promise);
              }
            });
          }

          AlertService.addWarningMessage('Uploading attachments...');
          var parentPromise = $q.all(promises);
          parentPromise.then(
            angular.bind(this, function () {
              this.defineOriginalAttachments(angular.copy(updatedAttachments));
            }),
            function (error) {
              AlertService.addStrataErrorMessage(error);
            }
          );

          return parentPromise;
        }
      };
    }
  ]);