'use strict';
/*jshint unused:vars */

angular.module('RedhatAccess.cases')
.directive('rhaSearchbox', function () {
  return {
    templateUrl: 'cases/views/searchBox.html',
    restrict: 'EA',
    controller: 'SearchBox',
    scope: {
      placeholder: '='
    }
  };
});
