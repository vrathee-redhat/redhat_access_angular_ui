'use strict';
/*jshint unused:vars */

angular.module('RedhatAccess.cases')
.directive('rhaSelectLoadingIndicator', function () {
  return {
    templateUrl: 'cases/views/selectLoadingIndicator.html',
    restrict: 'E',
    transclude: true,
    scope: {
      loading: '='
    }
  };
});
