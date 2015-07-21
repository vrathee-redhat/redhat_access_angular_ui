'use strict';
/*jshint camelcase: false */
angular.module('RedhatAccess.ascension').controller('CaseDetails', [
    '$scope',
    'CaseDetailsService',
    'securityService',
    'AUTH_EVENTS',
    'TOPCASES_EVENTS',
    'RHAUtils',
    'AlertService',
    function ($scope, CaseDetailsService, securityService, AUTH_EVENTS, TOPCASES_EVENTS, RHAUtils,AlertService) {
    	$scope.CaseDetailsService = CaseDetailsService;
        $scope.showEditCase = false;



    	$scope.init = function () {
            CaseDetailsService.fetchProducts();
            CaseDetailsService.fetchSeverities();
            CaseDetailsService.fetchStatuses();
            CaseDetailsService.fetchInternalPriorities();
            CaseDetailsService.fetchInternalStatuses();
            CaseDetailsService.fetchCaseTypes();
            CaseDetailsService.fetchCaseResolutions();
        };

        $scope.edit = function() {
            $scope.showEditCase = true;
        };

        $scope.updatingDetails = false;
        $scope.updateCase = function() {
            $scope.updatingDetails = true;
            if (CaseDetailsService.kase !== undefined) {
                CaseDetailsService.updateCaseDetails().then(function () {
                    $scope.updatingDetails = false;
                    $scope.showEditCase = false;
                    $scope.caseOverviewForm.$setPristine();
                }, function (error) {
                    AlertService.addUDSErrorMessage(error);
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

        $scope.$on(TOPCASES_EVENTS.caseDetailsFetched, function () {
            if(RHAUtils.isNotEmpty(CaseDetailsService.kase.product)) {
                CaseDetailsService.getVersions(CaseDetailsService.kase.product);
            }
        });


    }
]);
