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
            controller: 'CaseQueue',
            templateUrl: 'ascension/views/caseQueue.html'
        });
    }
]);