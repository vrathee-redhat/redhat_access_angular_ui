'use strict';

angular.module('RedhatAccess.cases')
.directive('rhaListattachments', function () {
  return {
    templateUrl: 'cases/views/listAttachments.html',
    restrict: 'A',
    controller: 'ListAttachments',
    scope: {
      disabled: '='
    }
  };
});
