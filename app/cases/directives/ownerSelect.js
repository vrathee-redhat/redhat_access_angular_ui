'use strict';
/*jshint unused:vars */
angular.module('RedhatAccess.cases')
.directive('rhaOwnerselect', function () {
  return {
    templateUrl: 'cases/views/ownerSelect.html',
    restrict: 'A',
    controller: 'OwnerSelect',
    scope: {
      onchange: '&'
    }
  };
});
