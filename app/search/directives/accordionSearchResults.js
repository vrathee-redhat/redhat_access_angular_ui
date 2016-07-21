'use strict';

export default (SEARCH_CONFIG) => {
    'ngInject';

    return {
        restrict: 'AE',
        scope: false,
        template: require('../views/accordion_search_results.jade'),
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
