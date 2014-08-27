/*jshint camelcase: false */
'use strict';
/*jshint unused:vars */
/**
 * @ngdoc module
 * @name
 *
 * @description
 *
 */
angular.module('RedhatAccess.search').directive('rhaListsearchresults', function () {
    return {
        restrict: 'AE',
        scope: false,
        templateUrl: 'search/views/list_search_results.html'
    };
});
