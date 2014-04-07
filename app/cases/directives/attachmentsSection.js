'use strict';

angular.module('RedhatAccessCases')
.directive('rhaCaseAttachments', function () {
  return {
    templateUrl: 'cases/views/attachmentsSection.html',
    restrict: 'EA',
    controller: 'AttachmentsSection',
    scope: {
      attachmentsjson: '=',
      caseid: '='
    },
    link: function postLink(scope, element, attrs) {
    }
  };
});
