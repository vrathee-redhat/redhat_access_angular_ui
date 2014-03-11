'use strict';

angular.module('RedhatAccessCases')
.directive('rhaAttachProductLogs', function () {
  return {
    templateUrl: 'views/case/attachProductLogs.html',
    restrict: 'EA',
    link: function postLink(scope, element, attrs) {
    }
  };
});
