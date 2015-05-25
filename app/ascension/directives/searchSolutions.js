'use strict';
angular.module('RedhatAccess.ascension').directive('rhaSearchsolutions', function () {
    return {
        templateUrl: 'ascension/views/searchSolutions.html',
        restrict: 'A',
        controller: 'SearchSolutions'
    };
});
