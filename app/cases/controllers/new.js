'use strict';

angular.module('RedhatAccessCases')
.controller('NewController', [
  '$scope',
  '$state',
  'attachments',
  'productsJSON',
  'severityJSON',
  'groupsJSON',
  function ($scope, $state, attachments, productsJSON, severityJSON, groupsJSON) {
    $scope.products = productsJSON;
    $scope.versions = [];
    $scope.versionDisabled = true;
    $scope.versionLoading = false;
    $scope.incomplete = true;
    $scope.severities = severityJSON;
    $scope.severity = severityJSON[severityJSON.length - 1];
    $scope.groups = groupsJSON;
    $scope.submitProgress = 0;
    $scope.attachments = attachments;

    $scope.validateForm = function() {
      if ($scope.product == null || $scope.product == "" ||
          $scope.version == null || $scope.version == "" ||
          $scope.summary == null || $scope.summary == "" ||
          $scope.description == null || $scope.description == "") {
        $scope.incomplete = true;
      } else {
        $scope.incomplete = false;
      }
    };

    $scope.getProductVersions = function(product) {
      $scope.version = "";
      $scope.versionDisabled = true;
      $scope.versionLoading = true;

      strata.products.versions(
          product.code,
          function(response){
            $scope.versions = response;
            $scope.validateForm();
            $scope.versionDisabled = false;
            $scope.versionLoading = false;
            $scope.$apply();
          },
          function(error){
            console.log(error);
          });
    };

    $scope.setPage = function(page) {
      $scope.isPage1 = page == 1 ? true : false;
      $scope.isPage2 = page == 2 ? true : false;
    };

    $scope.doNext = function() {
      $scope.setPage(2);
    };

    $scope.doPrevious = function() {
      $scope.setPage(1);
    };

    $scope.doSubmit = function() {

      $scope.submitProgress = '10';

      var caseJSON = {
        'product': $scope.product.code,
        'version': $scope.version,
        'summary': $scope.summary,
        'description': $scope.description,
        'severity': $scope.severity.name,
        'folderNumber': $scope.caseGroup == null ? '' : $scope.caseGroup.number
      };

      strata.cases.post(
          caseJSON,
          function(caseNumber) {
            if ($scope.attachments.length > 0) {
              //TODO: upload attachments
              $scope.submitProgress = '55';
            } else {
              $scope.submitProgress = '100';
            }

            $state.go('case', {id: caseNumber});
//            window.location = '/#/case/' + caseNumber; //TODO: get rid of hardcoded URL
          },
          function(error) {
            console.log(error);
          }
      );

    };

    $scope.setPage(1);
  }]);

