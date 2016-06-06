/**
 * Created by jtrantin on 25.2.16.
 */
angular.module('RedhatAccess.cases').directive('rhaFocusOn', [
    '$timeout',
    function ($timeout) {
        return function (scope, elem, attr) {
            scope.$on(attr.rhaFocusOn, function () {
                $timeout(function () {
                    elem[0].focus();
                });
            });
        };
    }
]);
