'use strict';

angular.module('RedhatAccess.logViewer')
.directive('fillDown', [
	'$window', 
	'$timeout', 
	function($window, $timeout) {
		return {
			restrict: 'EA',
			link: function postLink(scope, element, attrs) {
				scope.onResizeFunction = function() {
					var distanceToTop = element[0].getBoundingClientRect().top;
					var height = $window.innerHeight - distanceToTop - 21;
					if(element[0].id == 'fileList'){
						height -= 34;
					}
					return scope.windowHeight = height;
				};
	      // This might be overkill?? 
	      //scope.onResizeFunction();
	      angular.element($window).bind('resize', function() {
	      	scope.onResizeFunction();
	      	scope.$apply();
	      });
	      angular.element($window).bind('click', function() {
	      	scope.onResizeFunction();
	      	scope.$apply();
	      });
	      $timeout(scope.onResizeFunction, 100);
	      // $(window).load(function(){
	      // 	scope.onResizeFunction();
	      // 	scope.$apply();
	      // });
	      // scope.$on('$viewContentLoaded', function() {
	      // 	scope.onResizeFunction();
	      // 	//scope.$apply();
	      // });
	  }
	}
}
]);