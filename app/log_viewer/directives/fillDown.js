'use strict';

export default ($window, $timeout) => {
    'ngInject';
    
    return {
        restrict: 'A',
        link: function postLink(scope, element) {
            scope.onResizeFunction = function () {
                var distanceToTop = element[0].getBoundingClientRect().top;
                var height = $window.innerHeight - distanceToTop - 21;
                if (element[0].id === 'fileList') {
                    height -= 34;
                }
                scope.windowHeight = height;
                return scope.windowHeight;
            };
            // This might be overkill??
            //scope.onResizeFunction();
            angular.element($window).bind('resize', function () {
                scope.onResizeFunction();
                scope.$apply();
            });
            angular.element($window).bind('click', function () {
                scope.onResizeFunction();
                scope.$apply();
            });
            $timeout(scope.onResizeFunction, 100);    // $(window).load(function(){
                                                      //  scope.onResizeFunction();
                                                      //  scope.$apply();
                                                      // });
                                                      // scope.$on('$viewContentLoaded', function() {
                                                      //  scope.onResizeFunction();
                                                      //  //scope.$apply();
                                                      // });
        }
    };
}
