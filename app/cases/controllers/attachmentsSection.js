'use strict';

angular.module('RedhatAccessCases')
.controller('AttachmentsSection', [
  '$scope',
  '$filter',
  '$q',
  'attachments',
  function(
      $scope,
      $filter,
      $q,
      attachments) {

    if (angular.isArray($scope.attachmentsjson)) {
      attachments.items = $scope.attachmentsjson;
    } else {
      attachments.clear();
    }

    $scope.originalAttachments = angular.copy(attachments.items);
    $scope.updatingAttachments = false;
    $scope.disableUpdateAttachmentsButton = false;

    $scope.updateAttachments = function() {
      if (!angular.equals($scope.originalAttachments, attachments.items)) {
        var promises = [];

        //find new attachments
        for (var i in attachments.items) {
          if (!attachments.items[i].hasOwnProperty('uuid')) {
            var promise = attachments.post(
                attachments.items[i].file,
                $scope.caseid
            )

            promise.then(function(uri) {
              attachments.items[i].uri = uri;
            });

            promises.push(promise);
          }
        }

        //find removed attachments
        jQuery.grep($scope.originalAttachments, function(origAttachment) {
          var attachment =
              $filter('filter')(attachments.items, {'uuid': origAttachment.uuid});

          if (attachment.length == 0) {
            promises.push(
                attachments.delete(
                    origAttachment.uuid,
                    $scope.caseid
                )
            );
          }
        });

        $scope.updatingAttachments = true;
        var parentPromise = $q.all(promises);
        parentPromise.then(
            function() {
              $scope.originalAttachments = angular.copy(attachments.items);
              $scope.updatingAttachments = false;
            },
            function(error) {
              console.log("Problem creating attachments");
              console.log(error);
            }
        );
      }
    };
  }
]);
