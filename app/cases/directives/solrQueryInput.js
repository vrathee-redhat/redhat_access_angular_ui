'use strict';
/*jshint unused:vars */
angular.module('RedhatAccess.cases').directive('rhaSolrQueryInput', function () {
    return {
        templateUrl: 'cases/views/solrQueryInput.html',
        restrict: 'A',
        controller: 'SolrInputController',
        scope: {
        }
    };
});
