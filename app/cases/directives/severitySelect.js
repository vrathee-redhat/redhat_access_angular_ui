'use strict';
/*jshint unused:vars */
angular.module('RedhatAccess.cases')
.directive('rhaSeveritySelect', function () {
  return {
    templateUrl: 'cases/views/severitySelect.html',
    restrict: 'E',
    controller: 'SeveritySelect',
    scope: {
      onchange: '&'
    }
  };
});
