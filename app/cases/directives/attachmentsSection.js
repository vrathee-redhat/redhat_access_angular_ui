'use strict';
/*jshint unused:vars */

angular.module('RedhatAccess.cases')
.directive('rhaCaseattachments', function () {
  return {
    templateUrl: 'cases/views/attachmentsSection.html',
    restrict: 'EA',
    controller: 'AttachmentsSection',
    scope: {
      loading: '='
    },
    link: function postLink(scope, element, attrs) {
    }
  };
});
