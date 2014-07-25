'use strict';
/*jshint unused:vars */
angular.module('RedhatAccess.cases')
.directive('rhaDeletegroupbutton', function () {
  return {
    templateUrl: 'cases/views/deleteGroupButton.html',
    restrict: 'A',
    controller: 'DeleteGroupButton'
  };
});
