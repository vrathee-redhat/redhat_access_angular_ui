'use strict';
/*jshint unused:vars */

angular.module('RedhatAccess.cases')
.directive('rhaSearchBox', function () {
  return {
    templateUrl: 'cases/views/searchBox.html',
    restrict: 'E',
    controller: 'SearchBox',
    scope: {
      placeholder: '='
    }
  };
});
