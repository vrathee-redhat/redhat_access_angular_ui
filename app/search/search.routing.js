'use strict';

export default ($stateProvider) => {
    'ngInject';
    
    $stateProvider.state('search', {
        url: '/search',
        controller: 'SearchController',
        template: require('./views/search.jade')
    }).state('search_accordion', {
        url: '/search2',
        controller: 'SearchController',
        template: require('./views/accordion_search.jade')
    });
}
