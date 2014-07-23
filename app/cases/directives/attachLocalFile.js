'use strict';

angular.module('RedhatAccess.cases')
.directive('rhaAttachlocalfile', function () {
  return {
    templateUrl: 'cases/views/attachLocalFile.html',
    restrict: 'EA',
    controller: 'AttachLocalFile',
    scope: {
      disabled: '='
    }
  };
});
