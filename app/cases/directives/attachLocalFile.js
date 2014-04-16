'use strict';

angular.module('RedhatAccess.cases')
.directive('rhaAttachLocalFile', function () {
  return {
    templateUrl: 'cases/views/attachLocalFile.html',
    restrict: 'EA',
    controller: 'AttachLocalFile',
    link: function postLink(scope, element, attrs) {
    }
  };
});
