'use strict';
/*jshint unused:vars */
angular.module('RedhatAccess.cases')
.directive('rhaStatusSelect', function () {
  return {
    templateUrl: 'cases/views/statusSelect.html',
    restrict: 'E',
    controller: 'StatusSelect',
    scope: {
      onchange: '&'
    }
  };
});
