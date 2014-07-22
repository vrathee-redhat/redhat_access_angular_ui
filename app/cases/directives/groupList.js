'use strict';
/*jshint unused:vars */
angular.module('RedhatAccess.cases')
.directive('rhaGrouplist', function () {
  return {
    templateUrl: 'cases/views/groupList.html',
    restrict: 'EA',
    controller: 'GroupList'
  };
});
