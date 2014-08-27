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
angular.module('RedhatAccess.search', [
  'ui.router',
  'RedhatAccess.template',
  'RedhatAccess.security',
  'ui.bootstrap',
  'ngSanitize',
  'RedhatAccess.ui-utils',
  'RedhatAccess.common',
  'RedhatAccess.header'
])
  .constant('RESOURCE_TYPES', {
    article: 'Article',
    solution: 'Solution',

  })
  .constant('SEARCH_PARAMS', {
    limit: 10

  })
  .value('SEARCH_CONFIG', {
    openCaseRef: null,
    showOpenCaseBtn: true
  })
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider.state('search', {
        url: '/search',
        controller: 'SearchController',
        templateUrl: 'search/views/search.html'
      }).state('search_accordion', { //TEMPORARY
        url: '/search2',
        controller: 'SearchController',
        templateUrl: 'search/views/accordion_search.html'

      });
    }
  ]);
