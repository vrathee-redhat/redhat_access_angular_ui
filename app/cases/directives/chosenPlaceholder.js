'use strict';

export default function () {
    return {
        priority: 1,
        restrict: 'A',
        link: {
            pre: function (scope, element, attr, ngModel) {
                var defaultText = attr.placeholder;
                angular.element(element[0]).attr('data-placeholder', defaultText);
            }
        }
    }
}
