'use strict';

angular.module('RedhatAccessCases')
.directive('rhaListAttachments', function () {
  return {
    templateUrl: 'views/case/listAttachments.html',
    restrict: 'EA',
    controller: 'ListAttachments',
    scope: {
      attachments: '=attachments'
    },
    link: function postLink(scope, element, attrs) {
    }
  };
});
