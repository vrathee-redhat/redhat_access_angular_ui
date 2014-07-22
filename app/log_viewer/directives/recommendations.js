'use strict';

angular.module('RedhatAccess.logViewer')
.directive('rhaRecommendations', function () {
  return {
    templateUrl: 'log_viewer/views/recommendations.html',
    restrict: 'EA',
    link: function postLink(scope, element, attrs) {
    }
  };
});