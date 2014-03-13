'use strict';

angular.module('RedhatAccessCases')
.directive('rhaListAttachments', function () {
  return {
    templateUrl: 'cases/views/listAttachments.html',
    restrict: 'EA',
    controller: 'ListAttachments',
    scope: {
      attachments: '=attachments'
    },
    link: function postLink(scope, element, attrs) {
    }
  };
});
