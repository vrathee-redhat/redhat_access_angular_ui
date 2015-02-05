'use strict';
/*jshint camelcase: false*/
angular.module('RedhatAccess.cases').controller('New', [
    '$scope',
    '$state',
    '$q',
    '$timeout',
    '$sanitize',
    '$modal',
    '$sce',
    'SearchResultsService',
    'AttachmentsService',
    'strataService',
    'RecommendationsService',
    'CaseService',
    'AlertService',
    'HeaderService',
    'ProductsService',
    'securityService',
    '$rootScope',
    'AUTH_EVENTS',
    '$location',
    'RHAUtils',
    'NEW_DEFAULTS',
    'NEW_CASE_CONFIG',
    'translate',
    function ($scope, $state, $q, $timeout, $sanitize, $modal, $sce, SearchResultsService, AttachmentsService, strataService, RecommendationsService, CaseService, AlertService, HeaderService, ProductsService, securityService, $rootScope, AUTH_EVENTS, $location, RHAUtils, NEW_DEFAULTS, NEW_CASE_CONFIG, translate) {
        $scope.NEW_CASE_CONFIG = NEW_CASE_CONFIG;
        $scope.versions = [];
        $scope.versionDisabled = true;
        $scope.versionLoading = false;
        $scope.incomplete = true;
        $scope.submitProgress = 0;
        AttachmentsService.clear();
        CaseService.clearCase();
        RecommendationsService.clear();
        SearchResultsService.clear();
        AlertService.clearAlerts();
        $scope.CaseService = CaseService;
        $scope.RecommendationsService = RecommendationsService;
        $scope.securityService = securityService;
        $scope.HeaderService = HeaderService;
        $scope.ie8 = window.ie8;
        $scope.ie9 = window.ie9;
        $scope.ie8Message='We’re unable to accept file attachments from Internet Explorer 8 (IE8) at this time. Please see our instructions for providing files <a href=\"https://access.redhat.com/solutions/2112\" target="_blank\">via FTP </a> in the interim.';

        $scope.showRecommendationPanel = false;
        $scope.notifiedUsers = [];

        // Instantiate these variables outside the watch
        var waiting = false;
        $scope.$watch('CaseService.kase.description + CaseService.kase.summary', function () {
            if (!waiting){
                if(RHAUtils.isNotEmpty(CaseService.kase.description) || RHAUtils.isNotEmpty(CaseService.kase.summary))
                {
                    $scope.makeRecommendationPanelVisible();
                }
                waiting = true;
                $timeout(function() {
                    waiting = false;
                    RecommendationsService.getRecommendations();
                }, 500); // delay 500 ms
            }
        });

        
        CaseService.onOwnerSelectChanged = function () {
            if (CaseService.owner !== undefined) {
                CaseService.populateEntitlements(CaseService.owner);
                CaseService.populateGroups(CaseService.owner);
            }
            CaseService.validateNewCasePage1();
        };

        /**
       * Populate the selects
       */
        $scope.initSelects = function () {
            CaseService.clearCase();
            RecommendationsService.clear();
            CaseService.populateUsers();
            $scope.severitiesLoading = true;
            ProductsService.getProducts();
            strataService.values.cases.severity().then(function (severities) {
                CaseService.severities = severities;
                CaseService.kase.severity = severities[severities.length - 1];
                $scope.severitiesLoading = false;
            }, function (error) {
                AlertService.addStrataErrorMessage(error);
            });
            $scope.groupsLoading = true;
            CaseService.populateGroups().then(function (groups) {
                $scope.groupsLoading = false;
            }, function (error) {
                AlertService.addStrataErrorMessage(error);
            });
        };
        $scope.initDescription = function () {
            var searchObject = $location.search();
            var setDesc = function (desc) {
                CaseService.kase.description = desc;
                $scope.getRecommendations();
            };
            if(!$scope.NEW_CASE_CONFIG.isPCM) {
                if (searchObject.data) {
                    setDesc(searchObject.data);
                } else {
                    //angular does not  handle params before hashbang
                    //@see https://github.com/angular/angular.js/issues/6172
                    var queryParamsStr = window.location.search.substring(1);
                    var parameters = queryParamsStr.split('&');
                    for (var i = 0; i < parameters.length; i++) {
                        var parameterName = parameters[i].split('=');
                        if (parameterName[0] === 'data') {
                            setDesc(decodeURIComponent(parameterName[1]));
                        }
                    }
                }
            }
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
            $scope.initSelects();
            $scope.initDescription();
        }
        $scope.authLoginSuccess = $rootScope.$on(AUTH_EVENTS.loginSuccess, function () {
            $scope.firePageLoadEvent();
            $scope.initSelects();
            $scope.initDescription();
            AlertService.clearAlerts();
            RecommendationsService.failureCount = 0;
        });

        $scope.$on('$destroy', function () {
            $scope.authLoginSuccess();
        });

        /**
       * Go to a page in the wizard
       *
       * @param page
       */
        $scope.gotoPage = function (page) {
            $scope.isPage1 = page === 1 ? true : false;
            $scope.isPage2 = page === 2 ? true : false;
        };
        /**
       * Navigate forward in the wizard
       */
        $scope.doNext = function () {
            $scope.gotoPage(2);
        };
        /**
       * Navigate back in the wizard
       */
        $scope.doPrevious = function () {
            $scope.gotoPage(1);
        };
        $scope.submittingCase = false;

        $scope.setSearchOptions = function (showsearchoptions) {
            CaseService.showsearchoptions = showsearchoptions;
            if(CaseService.groups.length === 0){
                CaseService.populateGroups().then(function (){
                    CaseService.buildGroupOptions();
                });
            } else{
                CaseService.buildGroupOptions();
            }
        };

        /**
       * Create the case with attachments
       */
        $scope.doSubmit = function ($event) {
            AttachmentsService.proceedWithoutAttachments = false;

            var redirectToCase = function (caseNumber) {
                $state.go('edit', { id: caseNumber });
                AlertService.clearAlerts();
                CaseService.submittingCase = false;
            };

            var caseUploadsAndUpdates = function(caseNumber){
                if (window.chrometwo_require !== undefined) {
                    chrometwo_require(['analytics/main'], function (analytics) {
                        analytics.trigger('OpenSupportCaseSubmit', $event);
                    });
                }
                angular.forEach($scope.notifiedUsers, function (user) {
                    strataService.cases.notified_users.add(caseNumber, user).then(function () {
                        AlertService.addSuccessMessage(translate('Successfully added ') + ' ' + user + translate(' to receieve email notifications.'));
                    }, function (error) {
                        AlertService.addStrataErrorMessage(error);
                    });
                });

                if ((AttachmentsService.updatedAttachments.length > 0 || AttachmentsService.hasBackEndSelections()) && NEW_CASE_CONFIG.showAttachments) {
                    AttachmentsService.updateAttachments(caseNumber).then(function () {
                        redirectToCase(caseNumber);
                    }, function (error) {
                        AlertService.addStrataErrorMessage(error);
                        this.submittingCase = false;
                    });
                } else if(NEW_CASE_CONFIG.showAttachments && $scope.ie8 || NEW_CASE_CONFIG.showAttachments && $scope.ie9 ) {
                    $scope.ieFileUpload(caseNumber);
                } else {
                    redirectToCase(caseNumber);
                }
            }

            if(AttachmentsService.updatedAttachments.length == 0){
                var proceedWithoutAttachModal = $modal.open({
                    templateUrl: 'cases/views/proceedWithoutAttachModal.html',
                    controller: 'ProceedWithoutAttachModal'
                });
                proceedWithoutAttachModal.result.then(function(){
                    if(AttachmentsService.proceedWithoutAttachments){
                        CaseService.createCase().then(function (caseNumber) {
                            caseUploadsAndUpdates(caseNumber)
                        }, function (error) {
                            AlertService.addStrataErrorMessage(error);
                            this.submittingCase = false;
                        });
                    }
                });
            } else{
                CaseService.createCase().then(function (caseNumber) {
                    caseUploadsAndUpdates(caseNumber)
                }, function (error) {
                    AlertService.addStrataErrorMessage(error);
                    this.submittingCase = false;
                });
            }
        };

        $scope.ieFileUpload = function(caseNumber) {
            var form = document.getElementById('fileUploaderForm');
            var iframeId = document.getElementById('upload_target');
            form.action = 'https://' + window.location.host + '/rs/cases/' + caseNumber + '/attachments';

            var redirectToCase = function (caseNumber) {
                $state.go('edit', { id: caseNumber });
                AlertService.clearAlerts();
                $scope.submittingCase = false;
            };

            var eventHandler = function () {
                if (iframeId.detachEvent){
                    iframeId.detachEvent('onload', eventHandler);
                }
                if (iframeId.removeEventListener){
                    iframeId.removeEventListener('load', eventHandler, false);
                }
                if(!$scope.ie8){
                    var content;
                    if (iframeId.contentDocument && iframeId.contentDocument.body !== null) {
                        content = iframeId.contentDocument.body.innerText;
                    } else if (iframeId.contentWindow && iframeId.contentWindow.document.body !== null) {
                        content = iframeId.contentWindow.document.body.innerText;
                    }
                    if (content !== undefined && content.length) {
                        var parser = document.createElement('a');
                        parser.href = content;
                        var splitPath = parser.pathname.split('/');
                        if(splitPath !== undefined && splitPath[4] !== undefined){
                            redirectToCase(caseNumber);
                            $scope.$apply();
                        } else {
                            AlertService.addDangerMessage(translate('Error: Failed to upload attachment. Message: ' + content));
                            redirectToCase(caseNumber);
                            $scope.$apply();
                        }
                    } else {
                        AlertService.addDangerMessage(translate('Error: Failed to upload attachment. Message: ' + content));
                        redirectToCase(caseNumber);
                        $scope.$apply();
                    }
                }else {
                    redirectToCase(caseNumber);
                    $scope.$apply();
                }
            };

            if (iframeId.addEventListener){
                iframeId.addEventListener('load', eventHandler, true);
            } else if (iframeId.attachEvent){
                iframeId.attachEvent('onload', eventHandler);
            }
            form.submit();
        };

        $scope.gotoPage(1);

        $scope.authEventLogoutSuccess = $rootScope.$on(AUTH_EVENTS.logoutSuccess, function () {
            CaseService.clearCase();
        });
        $scope.$on('$destroy', function () {
            CaseService.clearCase();
        });
        $scope.makeRecommendationPanelVisible =function(){
            $scope.showRecommendationPanel = true;
        };
    }
]);
