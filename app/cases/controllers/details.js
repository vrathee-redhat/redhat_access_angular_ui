'use strict';

angular.module('RedhatAccessCases')
.controller('Details', [
  '$scope',
  '$stateParams',
  '$filter',
  '$q',
  'attachments',
  'caseJSON',
  'attachmentsJSON',
  'commentsJSON',
  'caseTypesJSON',
  'severitiesJSON',
  'groupsJSON',
  'productsJSON',
  'statusesJSON',
  function(
      $scope,
      $stateParams,
      $filter,
      $q,
      attachments,
      caseJSON,
      attachmentsJSON,
      commentsJSON,
      caseTypesJSON,
      severitiesJSON,
      groupsJSON,
      productsJSON,
      statusesJSON) {

    if (caseJSON) {
      $scope.details = {};
      $scope.details.caseId = $stateParams.id;
      $scope.details.summary = caseJSON.summary;
      $scope.details.description = caseJSON.description;
      $scope.details.type = {'name': caseJSON.type};
      $scope.details.severity = {'name': caseJSON.severity};
      $scope.details.status = {'name': caseJSON.status};
      $scope.details.alternate_id = caseJSON.alternate_id;
      $scope.details.product = {'name': caseJSON.product};
      $scope.details.sla = caseJSON.entitlement.sla;
      $scope.details.contact_name = caseJSON.contact_name;
      $scope.details.owner = caseJSON.owner;
      $scope.details.created_date = caseJSON.created_date;
      $scope.details.created_by = caseJSON.created_by;
      $scope.details.last_modified_date = caseJSON.last_modified_date;
      $scope.details.last_modified_by = caseJSON.last_modified_by;
      $scope.details.account_number = caseJSON.account_number;
      $scope.details.account_name = caseJSON.account_name;
      $scope.details.group = {'number': caseJSON.folder_number};

      $scope.bugzillas = caseJSON.bugzillas;
      $scope.hasBugzillas = Object.getOwnPropertyNames($scope.bugzillas).length != 0;

      if (caseJSON.recommendations) {
        if (Object.getOwnPropertyNames(caseJSON.recommendations).length != 0) {
          $scope.recommendations = caseJSON.recommendations.recommendation;
        }
      }

      $scope.title = 'Case ' + $scope.details.caseId;
    }

    if (angular.isArray(attachmentsJSON)) {
      attachments.items = attachmentsJSON;
      $scope.attachments = attachmentsJSON;
    } else {
      attachments.items = [];
    }

    if (commentsJSON) {
      $scope.comments = commentsJSON;
    }

    if (caseTypesJSON) {
      $scope.caseTypes = caseTypesJSON;
    }

    if (severitiesJSON) {
      $scope.severities = severitiesJSON;
    }

    if (groupsJSON) {
      $scope.groups = groupsJSON;
    }

    if (productsJSON) {
      $scope.products = productsJSON;
    }

    if (statusesJSON) {
      $scope.statuses = statusesJSON;
    }

    $scope.originalAttachments = angular.copy(attachments.items);
    $scope.updatingAttachments = false;
    $scope.disableUpdateAttachmentsButton = false;
//
//    $scope.$watch('attachments', function(newValue, oldValue) {
//      if (!angular.equals($scope.originalAttachments, $scope.attachments)) {
//        $scope.disableUpdateAttachmentsButton = false;
//      } else {
//        $scope.disableUpdateAttachmentsButton = true;
//      }
//    });

    $scope.updateAttachments = function() {
      if (!angular.equals($scope.originalAttachments, attachments.items)) {
        var promises = [];

        //find new attachments
        for (var i in attachments.items) {
          if (!attachments.items[i].hasOwnProperty('uuid')) {
            var promise = attachments.post(
                attachments.items[i].file,
                $scope.details.caseId
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
                    $scope.details.caseId
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

    $scope.updatingDetails = false;

    $scope.updateCase = function() {
      $scope.updatingDetails = true;

      var caseJSON = {
        'type': $scope.details.type.name,
        'severity': $scope.details.severity.name,
        'status': $scope.details.status.name,
        'alternateId': $scope.details.alternate_id,
//        'notes': $scope.details.notes,
        'product': $scope.details.product.name,
        'version': $scope.details.version,
        'summary': $scope.details.summary,
        'folderNumber': $scope.details.group.number
      };

      strata.cases.put(
          $scope.details.caseId,
          caseJSON,
          function() {
            $scope.caseDetails.$setPristine();
            $scope.updatingDetails = false;
            $scope.$apply();
          },
          function(error) {
            console.log(error);
            $scope.updatingDetails = false;
            $scope.$apply();
          }
      );

    };

    $scope.newComment = '';
    $scope.addingComment = false;

    $scope.addComment = function() {
      $scope.addingComment = true;

      strata.cases.comments.post(
        $scope.details.caseId,
        {'text': $scope.newComment},
        function(response) {

          //refresh the comments list
          strata.cases.comments.get(
            $scope.details.caseId,
            function(comments) {
              $scope.newComment = '';
              $scope.comments = comments;
              $scope.addingComment = false;
              $scope.$apply();
            },
            function(error) {
              console.log(error);
            }
          );
        },
        function(error) {
          console.log(error);
        }
      );
    };

    $scope.getProductVersions = function(product) {
      $scope.version = "";

      strata.products.versions(
          product.name,
          function(response){
            $scope.versions = response;
            $scope.$apply();
          },
          function(error){
            console.log(error);
          });
    };

    $scope.getProductVersions($scope.details.product);
    $scope.details.version = caseJSON.version;

  }]);

