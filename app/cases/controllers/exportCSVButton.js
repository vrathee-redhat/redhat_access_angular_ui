'use strict';
 /*jshint camelcase: false */
angular.module('RedhatAccess.cases')
.controller('ExportCSVButton', [
  '$scope',
  'strataService',
  'AlertService',
  function(
      $scope,
      strataService,
      AlertService) {

    $scope.exporting = false;

    $scope.export = function() {
      $scope.exporting = true;
      strataService.cases.csv().then(
        function(response) {
          $scope.exporting = false;
        },
        function(error) {
          AlertService.addStrataErrorMessage(error);
        }
      );
    };
  }
]);
