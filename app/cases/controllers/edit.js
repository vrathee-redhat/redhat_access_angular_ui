'use strict';
/*jshint camelcase: false */
angular.module('RedhatAccess.cases').controller('Edit', [
    '$scope',
    '$stateParams',
    '$filter',
    '$q',
    '$location',
    'AttachmentsService',
    'CaseService',
    'strataService',
    'HeaderService',
    'RecommendationsService',
    '$rootScope',
    'AUTH_EVENTS',
    'AlertService',
    'securityService',
    'EDIT_CASE_CONFIG',
    'RHAUtils',
    'CASE_EVENTS',
    function ($scope, $stateParams, $filter, $q, $location, AttachmentsService, CaseService, strataService, HeaderService, RecommendationsService, $rootScope, AUTH_EVENTS, AlertService, securityService, EDIT_CASE_CONFIG, RHAUtils, CASE_EVENTS) {
        $scope.EDIT_CASE_CONFIG = EDIT_CASE_CONFIG;
        $scope.securityService = securityService;
        $scope.AttachmentsService = AttachmentsService;
        $scope.CaseService = CaseService;
        $scope.HeaderService = HeaderService;
        CaseService.clearCase();
        $scope.loading = {};
        $scope.init = function () {
            RecommendationsService.clear();
            HeaderService.pageLoadFailure = false;
            $scope.loading.kase = true;
            $scope.recommendationsLoading = true;
            strataService.cases.get($stateParams.id).then(function (resp) {
                HeaderService.pageLoadFailure = false;
                var caseJSON = resp[0];
                var cacheHit = resp[1];
                if (!cacheHit) {
                    CaseService.defineCase(caseJSON);
                } else {
                    CaseService.setCase(caseJSON);
                }
                $rootScope.$broadcast(CASE_EVENTS.received);
                $scope.loading.kase = false;
                if (caseJSON.account_number !== undefined) {
                    strataService.accounts.get(caseJSON.account_number).then(function (account) {
                        CaseService.defineAccount(account);
                    }, function (error) {
                        AlertService.addStrataErrorMessage(error);
                    });
                }
                if (EDIT_CASE_CONFIG.showRecommendations) {
                    RecommendationsService.populatePinnedRecommendations();
                    RecommendationsService.getRecommendations(false).then(angular.noop, function (error) {
                        AlertService.addStrataErrorMessage(error);
                    });
                }
                if (EDIT_CASE_CONFIG.showEmailNotifications && !cacheHit) {
                    CaseService.defineNotifiedUsers();
                }
                
                //TODO
                // if (EDIT_CASE_CONFIG.showAttachments) {
                //     $scope.loading.attachments = true;
                //     strataService.cases.attachments.list($stateParams.id).then(function (attachmentsJSON) {
                //         AttachmentsService.defineOriginalAttachments(attachmentsJSON);
                //         $scope.loading.attachments= false;
                //     }, function (error) {
                //         AlertService.addStrataErrorMessage(error);
                //         $scope.loading.attachments= false;
                //     });
                // }
                // //TODO
                // if (EDIT_CASE_CONFIG.showComments) {
                //     $scope.loading.comments = true;
                //     strataService.cases.comments.get($stateParams.id).then(function (commentsJSON) {
                //         $scope.comments = commentsJSON;
                //         $scope.loading.comments = false;
                //     }, function (error) {
                //         AlertService.addStrataErrorMessage(error);
                //         $scope.loading.comments = false;
                //     });
                // }
            }, function (error) {
                HeaderService.pageLoadFailure = true;
            });
        };

        $scope.firePageLoadEvent = function () {
            if (window.chrometwo_require !== undefined) {
                chrometwo_require(['analytics/attributes', 'analytics/main'], function(attrs, paf) {
                    attrs.harvest();
                    paf.report();
                });
            }
        };

        if (securityService.loginStatus.isLoggedIn) {
            $scope.firePageLoadEvent();
            $scope.init();
        }
        $scope.authLoginEvent = $rootScope.$on(AUTH_EVENTS.loginSuccess, function () {
            $scope.firePageLoadEvent();
            $scope.init();
            AlertService.clearAlerts();
        });

        var caseSettled = function() {
            $scope.$broadcast('rhaCaseSettled');
        };

        $scope.loadingWatcher = $scope.$watch('loading', function(loadingObj){
            if($.isEmptyObject(loadingObj)) {
                return;
            }
            var allLoaded = true;
            for (var key in loadingObj) {
                if(loadingObj[key] !== false) {
                    allLoaded = false;
                }
            }
            if(allLoaded && !HeaderService.pageLoadFailure) {
                caseSettled();
            }
        }, true);

        $scope.loadingRecWatcher = $scope.$watch('recommendationsLoading', function(newVal) {
            if(newVal === false) {
                caseSettled();
            }
        });

        $scope.locationChange = $rootScope.$on('$locationChangeSuccess', function(event){
            var splitUrl = $location.path().split('/');
            if(splitUrl[2] !== undefined && $location.path().search(/case\/[0-9]{1,8}/i) !== -1){
                var newCaseId = splitUrl[2];
                var oldCaseId = $scope.CaseService.kase.case_number;
                if(newCaseId !== oldCaseId){
                    $stateParams.id = newCaseId;
                    CaseService.clearCase();
                    $scope.init();
                }
            }
        });

        $scope.$on('$destroy', function () {
            // Clean up listeners
            CaseService.clearCase();
            $scope.authLoginEvent();
            $scope.locationChange();
            $scope.loadingWatcher();
            $scope.loadingRecWatcher();
            RecommendationsService.clear();
        });
    }
]);
