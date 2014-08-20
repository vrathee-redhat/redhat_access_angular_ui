/*jshint camelcase: false */
'use strict';
/*global strata */
/*jshint unused:vars */

/**
 * @ngdoc module
 * @name
 *
 * @description
 *
 */
angular.module('RedhatAccess.search')
  .directive('rhaAccordionsearchresults', ['SEARCH_CONFIG',
    function (SEARCH_CONFIG) {
      return {
        restrict: 'AE',
        scope: false,
        templateUrl: 'search/views/accordion_search_results.html',
        link: function (scope, element, attr) {
          scope.showOpenCaseBtn = function () {
            if (SEARCH_CONFIG.showOpenCaseBtn && (attr && attr.opencase === 'true')) {
              return true;
            } else {
              return false;
            }
          };
        }
      };
    }
  ]);