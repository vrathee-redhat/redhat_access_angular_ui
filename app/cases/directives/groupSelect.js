'use strict';
/*jshint unused:vars */
angular.module('RedhatAccess.cases')
.directive('rhaGroupSelect', function () {
  return {
    templateUrl: 'cases/views/groupSelect.html',
    restrict: 'E',
    controller: 'GroupSelect',
    scope: {
      onchange: '&'
    }
  };
});
