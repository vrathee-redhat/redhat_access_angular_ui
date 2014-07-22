'use strict';
/*jshint unused:vars */

angular.module('RedhatAccess.cases')
.directive('rhaCompactcaselist', function () {
  return {
    templateUrl: 'cases/views/compactCaseList.html',
    controller: 'CompactCaseList',
    scope: {
    },
    restrict: 'EA',
    link: function postLink(scope, element, attrs) {
    }
  };
});
