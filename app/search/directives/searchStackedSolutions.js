'use strict';
angular.module('RedhatAccess.search').directive('rhaSearchstackedsolutions', function () {
    return {
        restrict: 'A',
        controller: 'SearchController',
        templateUrl: 'search/views/searchStackedSolutions.html'
    };
});
