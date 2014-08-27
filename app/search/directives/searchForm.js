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
angular.module('RedhatAccess.search').directive('rhaSearchform', function () {
    return {
        restrict: 'AE',
        scope: false,
        templateUrl: 'search/views/search_form.html'
    };
});
