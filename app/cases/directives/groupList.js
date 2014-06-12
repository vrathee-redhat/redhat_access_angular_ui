'use strict';
/*jshint unused:vars */
angular.module('RedhatAccess.cases')
.directive('rhaGroupList', function () {
  return {
    templateUrl: 'cases/views/groupList.html',
    restrict: 'E',
    controller: 'GroupList'
  };
});
