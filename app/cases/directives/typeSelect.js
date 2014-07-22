'use strict';
/*jshint unused:vars */
angular.module('RedhatAccess.cases')
.directive('rhaTypeselect', function () {
  return {
    templateUrl: 'cases/views/typeSelect.html',
    restrict: 'EA',
    controller: 'TypeSelect',
    scope: {
      onchange: '&'
    }
  };
});
