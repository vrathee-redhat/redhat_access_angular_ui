'use strict';

angular.module('RedhatAccess.cases')
.directive('rhaListattachments', function () {
  return {
    templateUrl: 'cases/views/listAttachments.html',
    restrict: 'EA',
    controller: 'ListAttachments',
    scope: {
      disabled: '='
    }
  };
});
