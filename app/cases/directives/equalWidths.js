'use strict';

export default function () {
    return {
        restrict: 'A',
        scope: {
            idToMatchWidth: '@'
        },
        link: function (scope, element, attrs) {
            var elemIdFrom = ('#' + scope.idToMatchWidth);
            var $elemFrom = angular.element(elemIdFrom);

            var setWidths = function () {
                if (element.is(':visible')) {
                    element.width($elemFrom.width());
                }
            };

            $(window).on('scroll', () => setWidths() );
            $(window).on('resize', () => setWidths() );

            scope.$on('$destroy', function () {
                $(window).off('scroll', () => setWidths() );
                $(window).off('resize', () => setWidths() );
            });
        }
    };
}
