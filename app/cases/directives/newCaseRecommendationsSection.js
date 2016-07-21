'use strict';

export default function () {
    return {
        template: require('../views/newCaseRecommendationsSection.jade'),
        restrict: 'A',
        controller: 'NewCaseRecommendationsController',
        scope: {itemsPerPage: '=?itemsPerPage'}
    };
}
