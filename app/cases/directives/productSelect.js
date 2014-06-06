'use strict';
/*jshint unused:vars */
angular.module('RedhatAccess.cases')
.directive('rhaProductSelect', function () {
  return {
    templateUrl: 'cases/views/productSelect.html',
    restrict: 'E',
    controller: 'ProductSelect',
    scope: {
      onchange: '&'
    }
  };
});
