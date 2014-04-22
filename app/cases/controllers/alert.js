'use strict';

angular.module('RedhatAccess.cases')
.controller('AlertController', [
  '$scope',
  'AlertService',
  function ($scope, AlertService) {
    $scope.AlertService = AlertService;

  }
]);
