'use strict';

angular.module('RedhatAccess.logViewer')
.directive('logsInstructionPane', function () {
  return {
    templateUrl: 'log_viewer/views/logsInstructionPane.html',
    restrict: 'EA',
    link: function postLink(scope, element, attrs) {
    }
  };
});