'use strict';

angular.module('RedhatAccess.logViewer')
.directive('logTabs', function () {
  return {
    templateUrl: 'log_viewer/views/logTabs.html',
    restrict: 'EA',
    link: function postLink(scope, element, attrs) {
    }
  };
});