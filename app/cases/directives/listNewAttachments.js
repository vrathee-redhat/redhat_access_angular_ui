'use strict';

angular.module('RedhatAccess.cases')
.directive('rhaListNewAttachments', function () {
  return {
    templateUrl: 'cases/views/listNewAttachments.html',
    restrict: 'EA',
    controller: 'ListNewAttachments'
  };
});
