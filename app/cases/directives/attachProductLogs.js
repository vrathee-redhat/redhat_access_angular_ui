'use strict';
/*jshint unused:vars */

angular.module('RedhatAccess.cases')
.directive('rhaAttachproductlogs', function () {
  return {
    templateUrl: 'cases/views/attachProductLogs.html',
    restrict: 'EA',
    link: function postLink(scope, element, attrs) {
    }
  };
});
