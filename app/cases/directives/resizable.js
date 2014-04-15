'use strict';

angular.module('RedhatAccessCases')
.directive('rhaResizable', [
  '$window',
  '$timeout',
  function ($window) {

    var link = function(scope, element, attrs) {

      scope.onResizeFunction = function() {
        var distanceToTop = element[0].getBoundingClientRect().top;
        var height = $window.innerHeight - distanceToTop;
        element.css('height', height);
      };

      angular.element($window).bind(
          'resize',
          function() {
            scope.onResizeFunction();
            scope.$apply();
          }
      );

      if (attrs.rhaDomReady !== undefined) {
        scope.$watch('rhaDomReady', function(newValue) {
          if (newValue) {
            scope.onResizeFunction();
          }
        });
      } else {
        scope.onResizeFunction();
      }


    };

    return {
      restrict: 'A',
      scope: {
        rhaDomReady: '='
      },
      link: link
    };
  }
]);
