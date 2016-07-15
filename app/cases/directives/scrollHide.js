'use strict';

export default function ($document, $timeout) {
    'ngInject';
    
    return {
        restrict: 'A',
        scope: {
            scrollHide: '@',
            scrollHideClass: '@',
            scrollHidePad: '@'
        },
        link: function (scope, element, attrs) {
            var elemId = ('#' + scope.scrollHide);
            var $compare = angular.element(elemId);
            var className = scope.scrollHideClass || '';
            var padding = +scope.scrollHidePad || 0;

            function shouldToggle() {
                return (element.offset().top >= $compare.offset().top + padding);
            }

            function toggle() {
                if (!$compare[0]) {
                    $compare = angular.element(elemId);
                    return;
                }
                if (shouldToggle()) {
                    element.addClass(className);
                } else {
                    element.removeClass(className);
                }
            }

            $document.on('scroll', toggle);
            $(window).on('resize', toggle);
            $timeout(toggle, 0);

            scope.$on('$destroy', function () {
                $document.off('scroll', toggle);
                $(window).off('resize', toggle);
            });
        }
    };
}
