'use strict';

angular.module('RedhatAccess.logViewer')
.directive('rhaNavsidebar', function () {
  return {
    templateUrl: 'log_viewer/views/navSideBar.html',
    restrict: 'EA',
    link: function postLink(scope, element, attrs) {
    }
  };
});