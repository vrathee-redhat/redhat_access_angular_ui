'use strict';

export default () => {
    return {
        restrict: 'AE',
        scope: false,
        template: require('../views/list_search_results.jade')
    };
}
