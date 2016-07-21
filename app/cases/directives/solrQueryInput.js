'use strict';

export default function () {
    return {
        template: require('../views/solrQueryInput.jade'),
        restrict: 'A',
        controller: 'SolrQueryInputController',
        scope: {
            solrQuery: '=',
            parseSuccessful: '=?',
            submit: '&'
        }
    };
}
