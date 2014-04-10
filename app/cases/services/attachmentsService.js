'use strict';

angular.module('RedhatAccessCases')
.service('AttachmentsService', [
  '$filter',
  '$q',
  'strataService',
  function ($filter, $q, strataService) {
    this.originalAttachments = [];
    this.updatedAttachments = [];
    this.updatingAttachments = false;

    this.clear = function() {
      this.items = [];
    };

    this.removeAttachment = function($index) {
      this.updatedAttachments.splice($index, 1);
    };

    this.getOriginalAttachments = function() {
      return this.originalAttachments;
    };

    this.getUpdatedAttachments = function() {
      return this.updatedAttachments;
    };

    this.addNewAttachment = function(attachment) {
      this.updatedAttachments.push(attachment);
    };

    this.defineOriginalAttachments = function(attachments) {
      if (!angular.isArray(attachments)) {
        this.originalAttachments = [];
      } else {
        this.originalAttachments = attachments;
      }

      this.updatedAttachments = angular.copy(this.originalAttachments);
    };

    this.updateAttachments = function(caseId) {
      if (!angular.equals(this.originalAttachments, this.updatedAttachments)) {
        var promises = [];
        var updatedAttachments = this.updatedAttachments;

        //find new attachments
        for (var i in updatedAttachments) {
          if (!updatedAttachments[i].hasOwnProperty('uuid')) {
            var promise = strataService.cases.attachments.post(
                updatedAttachments[i].file,
                caseId
            )

            promise.then(function(uri) {
              updatedAttachments[i].uri = uri;
            });

            promises.push(promise);
          }
        }

        //find removed attachments
        jQuery.grep(this.originalAttachments, function(origAttachment) {
          var attachment =
              $filter('filter')(updatedAttachments, {'uuid': origAttachment.uuid});

          if (attachment.length == 0) {
            promises.push(
                strataService.cases.attachments.delete(
                    origAttachment.uuid,
                    caseId
                )
            );
          }
        });

        this.updatingAttachments = true;
        var parentPromise = $q.all(promises);

        parentPromise.then(
            angular.bind(this, function(AttachmentsService, two, three, four) {
              this.defineOriginalAttachments(angular.copy(updatedAttachments));
              this.updatingAttachments = false;
            }),
            function(error) {
              console.log("Problem creating attachments");
              console.log(error);
            }
        );
      }
    };
}]);
