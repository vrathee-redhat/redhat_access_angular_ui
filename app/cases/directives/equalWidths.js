'use strict';
/*jshint unused:vars */
angular.module('RedhatAccess.cases').directive('equalWidths', function ($document,$window) {
	return {
		restrict: 'A',
		scope: {
			idToMatchWidth: '@'
		},
		link: function(scope, element, attrs) {
			var elemIdFrom = ('#' + scope.idToMatchWidth);
			var $elemFrom = angular.element(elemIdFrom);

			var setWidths = function(){
				if(element.is(':visible')){
					element.width($elemFrom.width());
				}
			};

			$(window).on('scroll', function() {
	            setWidths();
	        });
	        $(window).on('resize', function() {
	            setWidths();
	        });

	        scope.$on('$destroy', function() {
				$(window).off('scroll', function() {
                    setWidths();
                });
				$(window).off('resize', function() {
                    setWidths();
                });
			});
		}
	};
});
