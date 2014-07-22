'use strict';
/*jshint unused:vars */
angular.module('RedhatAccess.cases')
.directive('rhaSeverityselect', function () {
  return {
    templateUrl: 'cases/views/severitySelect.html',
    restrict: 'EA',
    controller: 'SeveritySelect',
    scope: {
      onchange: '&'
    }
  };
});
