'use strict';
/*jshint unused:vars */
angular.module('RedhatAccess.cases')
.directive('rhaProductselect', function () {
  return {
    templateUrl: 'cases/views/productSelect.html',
    restrict: 'EA',
    controller: 'ProductSelect',
    scope: {
      onchange: '&'
    }
  };
});
