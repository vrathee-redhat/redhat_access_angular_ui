'use strict';

angular.module('RedhatAccessCases')
.directive('rhaAttachProductLogs', function () {
  return {
    templateUrl: 'cases/views/attachProductLogs.html',
    restrict: 'EA',
    scope: {
      attachments: '=attachments'
    },
    link: function postLink(scope, element, attrs) {
    }
  };
});
