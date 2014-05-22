'use strict';
/*jshint camelcase: false */

angular.module('RedhatAccess.cases')
  .service('AttachmentsService', [
    '$filter',
    '$q',
    'strataService',
    'TreeViewSelectorUtils',
    '$http',
    'securityService',
    'AlertService',
    'CaseService',
    function ($filter, $q, strataService, TreeViewSelectorUtils, $http, securityService, AlertService, CaseService) {
      this.originalAttachments = [];
      this.updatedAttachments = [];

      this.backendAttachments = [];

      this.clear = function () {
        this.originalAttachments = [];
        this.updatedAttachments = [];
        this.backendAttachments = [];
      };

      this.updateBackEndAttachments = function (selected) {
        this.backendAttachments = selected;
      };

      this.hasBackEndSelections = function () {
        return TreeViewSelectorUtils.hasSelections(this.backendAttachments);
      };

      this.removeUpdatedAttachment = function ($index) {
        this.updatedAttachments.splice($index, 1);
      };

      this.removeOriginalAttachment = function ($index) {
        var attachment = this.originalAttachments[$index];

        var progressMessage =
          AlertService.addWarningMessage(
            'Deleting attachment: ' + attachment.file_name + ' - ' + attachment.uuid);

        strataService.cases.attachments.delete(attachment.uuid, CaseService.
        case .case_number).then(
          angular.bind(this, function () {
            AlertService.removeAlert(progressMessage);
            AlertService.addSuccessMessage(
              'Successfully deleted attachment: ' + attachment.file_name + ' - ' + attachment.uuid);
            this.originalAttachments.splice($index, 1);
          }),
          function (error) {
            AlertService.addStrataErrorMessage(error);
          }
        );
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
      };

      this.postBackEndAttachments = function (caseId) {
        var selectedFiles = TreeViewSelectorUtils.getSelectedLeaves(this.backendAttachments);
        return securityService.getBasicAuthToken().then(
          function (auth) {
            /*jshint unused:false */
            //we post each attachment separately
            var promises = [];
            angular.forEach(selectedFiles, function (file) {
              var jsonData = {
                authToken: auth,
                attachment: file,
                caseNum: caseId
              };
              var deferred = $q.defer();
              $http.post('attachments', jsonData).success(function (data, status, headers, config) {
                deferred.resolve(data);
                AlertService.addSuccessMessage(
                  'Successfully uploaded attachment ' +
                  jsonData.attachment + ' to case ' + caseId);
              }).error(function (data, status, headers, config) {
                console.log(data);
                var error_msg = '';
                switch (status) {
                case 401:
                  error_msg = ' : Unauthorised.';
                  break;
                case 409:
                  error_msg = ' : Invalid username/password.';
                  break;
                case 500:
                  error_msg = ' : Internal server error';
                  break;
                }
                AlertService.addDangerMessage(
                  'Failed to upload attachment ' +
                  jsonData.attachment + ' to case ' + caseId + error_msg);
                deferred.reject(data);
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
            angular.forEach(updatedAttachments, function (attachment) {
              if (!attachment.hasOwnProperty('uuid')) {
                var promise = strataService.cases.attachments.post(
                  attachment.file,
                  caseId
                );
                promise.then(
                  function (uri) {
                    attachment.uri = uri;
                    attachment.uuid = uri.slice(uri.lastIndexOf('/') + 1);
                    AlertService.addSuccessMessage(
                      'Successfully uploaded attachment ' +
                      attachment.file_name + ' to case ' + caseId);
                  },
                  function (error) {
                    AlertService.addStrataErrorMessage(error);
                  }
                );
                promises.push(promise);
              }
            });
          }

          var uploadingAlert = AlertService.addWarningMessage('Uploading attachments...');
          var parentPromise = $q.all(promises);
          parentPromise.then(
            angular.bind(this, function () {
              this.originalAttachments =
                this.originalAttachments.concat(this.updatedAttachments);
              this.updatedAttachments = [];
              AlertService.removeAlert(uploadingAlert);
            }),
            function (error) {
              AlertService.addStrataErrorMessage(error);
              AlertService.removeAlert(uploadingAlert);
            }
          );

          return parentPromise;
        }
      };
    }
  ]);