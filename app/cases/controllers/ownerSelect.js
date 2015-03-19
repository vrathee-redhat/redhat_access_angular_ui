/*global angular*/
'use strict';
angular.module('RedhatAccess.cases').controller('OwnerSelect', [
    '$scope',
    '$rootScope',
    'securityService',
    'AUTH_EVENTS',
    'CASE_EVENTS',
    'SearchCaseService',
    'CaseService',
    function ($scope, $rootScope, securityService, AUTH_EVENTS, CASE_EVENTS, SearchCaseService, CaseService) {
        $scope.securityService = securityService;
        $scope.SearchCaseService = SearchCaseService;
        $scope.CaseService = CaseService;
        $scope.fetchProductsForContact = function() {
            $rootScope.$broadcast(CASE_EVENTS.fetchProductsForContact);
        };
    }
]);
