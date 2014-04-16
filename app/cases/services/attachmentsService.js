'use strict';

angular.module('RedhatAccessCases')
  .service('AttachmentsService', [
    '$filter',
    '$q',
    'strataService',
    'TreeViewSelectorUtils',
    '$http',
    'securityService',
    function ($filter, $q, strataService, TreeViewSelectorUtils, $http, securityService) {
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
        var data = this.backendAttachments;
        securityService.getBasicAuthToken().then(
          function (auth) {
            var jsonData = {
              auth_token: auth,
              attachments: data,
              caseId: caseId
            };
            return $http.post('attachments', jsonData);
          }
        )
      };

      this.updateAttachments = function (caseId) {
        var hasLocalAttachments = !angular.equals(this.originalAttachments, this.updatedAttachments);
        var hasServerAttachments = this.hasBackEndSelections;
        if (hasLocalAttachments || hasServerAttachments) {
          var promises = [];
          if (hasServerAttachments) {
            promises.push(this.postBackEndAttachments(caseId));
          };
          var updatedAttachments = this.updatedAttachments;
          //find new attachments
          for (var i in updatedAttachments) {
            if (!updatedAttachments[i].hasOwnProperty('uuid')) {
              var promise = strataService.cases.attachments.post(
                updatedAttachments[i].file,
                caseId
              )
              promise.then(function (uri) {
                updatedAttachments[i].uri = uri;
              });

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
              promises.push(
                strataService.cases.attachments.delete(
                  origAttachment.uuid,
                  caseId
                )
              );
            }
          });

          var parentPromise = $q.all(promises);
          parentPromise.then(
            angular.bind(this, function (AttachmentsService, two, three, four) {
              this.defineOriginalAttachments(angular.copy(updatedAttachments));
            }),
            function (error) {
              console.log("Problem creating attachments");
              console.log(error);
            }
          );

          return parentPromise;
        }
      };
    }
  ]);