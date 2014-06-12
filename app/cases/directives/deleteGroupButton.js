'use strict';
/*jshint unused:vars */
angular.module('RedhatAccess.cases')
.directive('rhaDeleteGroupButton', function () {
  return {
    templateUrl: 'cases/views/deleteGroupButton.html',
    restrict: 'E',
    controller: 'DeleteGroupButton'
  };
});
