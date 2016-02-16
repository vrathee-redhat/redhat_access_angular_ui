'use strict';
/*jshint unused:vars */
angular.module('RedhatAccess.cases').directive('equalWidths', function ($document) {
	return {
		restrict: 'A',
		scope: {
			idToMatchWidth: '@',
		},
		link: function(scope, element, attrs) {
			var elemIdFrom = ('#' + scope.idToMatchWidth);
			var $elemFrom = angular.element(elemIdFrom);

			var setWidths = function(){
				element.width($elemFrom.width());
			}
			angular.element(document).on('scroll', function() {
	            setWidths();
	        });
	        angular.element($(window)).on('resize', function() {
	            setWidths();
	        });

	        scope.$on('$destroy', function() {
				$window.off('scroll', toggle);
				$(window).off('resize', toggle);
			});
		}
	};
});