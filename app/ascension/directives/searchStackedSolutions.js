'use strict';
angular.module('RedhatAccess.ascension').directive('rhaSearchstackedsolutions', function () {
    return {
        restrict: 'A',
        controller: 'SearchStackedSolutions',
        templateUrl: 'ascension/views/searchStackedSolutions.html'
    };
});
