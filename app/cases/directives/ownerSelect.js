'use strict';
/*jshint unused:vars */
angular.module('RedhatAccess.cases')
.directive('rhaOwnerSelect', function () {
  return {
    templateUrl: 'cases/views/ownerSelect.html',
    restrict: 'E',
    controller: 'OwnerSelect',
    scope: {
      onchange: '&'
    }
  };
});
