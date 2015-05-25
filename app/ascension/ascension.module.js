'use strict';
angular.module('RedhatAccess.ascension', [
    'RedhatAccess.template',
    'RedhatAccess.security',
    'RedhatAccess.ui-utils',
    'RedhatAccess.common',
    'RedhatAccess.header'
]).config([
    '$stateProvider',
    function($stateProvider) {
        $stateProvider.state('ascension', {
            url: '/ascension',
            controller: 'CaseView',
            templateUrl: 'ascension/views/caseView.html'
        });
    }
]);