'use strict';
/*jshint camelcase: false */
angular.module('RedhatAccess.ascension').controller('CaseDetails', [
    '$scope',
    'CaseDetailsService',
    'securityService',
    'AUTH_EVENTS',
    function ($scope, CaseDetailsService, securityService, AUTH_EVENTS) {
    	$scope.CaseDetailsService = CaseDetailsService;
        $scope.showEditCase = false;

    	$scope.init = function () {
            //CaseDetailsService.getCaseDetails(CaseDetailsService.cases[0]);
        };

        $scope.edit = function() {
            $scope.showEditCase = true;
            CaseDetailsService.fetchProducts();
            CaseDetailsService.fetchSeverities();
            CaseDetailsService.fetchStatuses();
        };

        $scope.updatingDetails = false;
        $scope.updateCase = function() {
            $scope.updatingDetails = true;
            if (CaseDetailsService.kase !== undefined) {
                CaseDetailsService.updateCase().then(function () {
                    $scope.updatingDetails = false;
                    $scope.caseOverviewForm.$setPristine();
                }, function (error) {
                    AlertService.addStrataErrorMessage(error);
                    $scope.updatingDetails = false;
                });
            }
        };

        $scope.resetData = function() {
            $scope.showEditCase = false;
            angular.copy(CaseDetailsService.prestineKase, CaseDetailsService.kase);
            $scope.caseOverviewForm.$setPristine();
        };

        if (securityService.loginStatus.isLoggedIn) {
            $scope.init();
        }

        $scope.$on(AUTH_EVENTS.loginSuccess, function () {
            $scope.init();
        });
    }
]);
