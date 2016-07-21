'use strict'

export default function ($timeout) {
    'ngInject';
    
    return function (scope, elem, attr) {
        scope.$on(attr.rhaFocusOn, function () {
            $timeout(function () {
                elem[0].focus();
            });
        });
    };
}
