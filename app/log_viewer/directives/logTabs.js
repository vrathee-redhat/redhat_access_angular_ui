'use strict';

angular.module('RedhatAccess.logViewer')
.directive('rhaLogtabs', function () {
  return {
    templateUrl: 'log_viewer/views/logTabs.html',
    restrict: 'EA',
    link: function postLink(scope, element, attrs) {
    }
  };
});