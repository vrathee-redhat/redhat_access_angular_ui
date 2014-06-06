'use strict';
/*jshint unused:vars */
angular.module('RedhatAccess.cases')
.directive('rhaTypeSelect', function () {
  return {
    templateUrl: 'cases/views/typeSelect.html',
    restrict: 'E',
    controller: 'TypeSelect',
    scope: {
      onchange: '&'
    }
  };
});
