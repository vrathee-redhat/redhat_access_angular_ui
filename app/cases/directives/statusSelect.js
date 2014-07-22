'use strict';
/*jshint unused:vars */
angular.module('RedhatAccess.cases')
.directive('rhaStatusselect', function () {
  return {
    templateUrl: 'cases/views/statusSelect.html',
    restrict: 'EA',
    controller: 'StatusSelect',
    scope: {
      onchange: '&'
    }
  };
});
