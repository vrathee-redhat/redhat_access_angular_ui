'use strict';

angular.module('RedhatAccess.logViewer')
.directive('rhaLogtabs', function () {
  return {
    templateUrl: 'log_viewer/views/logTabs.html',
    restrict: 'A',
    link: function postLink(scope, element, attrs) {
    }
  };
});