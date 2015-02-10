'use strict';
/*jshint camelcase: false*/
angular.module('RedhatAccess.cases').controller('New', [
    '$scope',
    '$state',
    '$q',
    '$timeout',
    '$sanitize',
    'SearchResultsService',
    'AttachmentsService',
    'strataService',
    'RecommendationsService',
    'CaseService',
    'AlertService',
    'securityService',
    '$rootScope',
    'AUTH_EVENTS',
    'CASE_EVENTS',
    '$location',
    'RHAUtils',
    'NEW_DEFAULTS',
    'NEW_CASE_CONFIG',
    '$http',
    'translate',
    function ($scope, $state, $q, $timeout, $sanitize, SearchResultsService, AttachmentsService, strataService, RecommendationsService, CaseService, AlertService, securityService, $rootScope, AUTH_EVENTS, CASE_EVENTS, $location, RHAUtils, NEW_DEFAULTS, NEW_CASE_CONFIG, $http, translate) {
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
        $scope.ie8 = window.ie8;
        $scope.ie9 = window.ie9;
        $scope.ie8Message='We’re unable to accept file attachments from Internet Explorer 8 (IE8) at this time. Please see our instructions for providing files <a href=\"https://access.redhat.com/solutions/2112\" target="_blank\">via FTP </a> in the interim.';

        $scope.showRecommendationPanel = false;

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
                    $scope.getRecommendations();
                }, 500); // delay 500 ms
            }
        });

        $scope.getRecommendations = function () {
            if ($scope.NEW_CASE_CONFIG.showRecommendations) {
                SearchResultsService.searchInProgress.value = true;
                var numRecommendations = 5;
                if($scope.NEW_CASE_CONFIG.isPCM){
                    numRecommendations = 30;
                    RecommendationsService.populatePCMRecommendations(numRecommendations).then(function () {
                        SearchResultsService.clear();
                        RecommendationsService.recommendations.forEach(function (recommendation) {
                            try {
                                recommendation.abstract = $sanitize(recommendation.abstract);
                            }
                            catch(err) {
                                recommendation.abstract = '';
                            }
                            SearchResultsService.add(recommendation);
                        });
                        SearchResultsService.searchInProgress.value = false;
                    }, function (error) {
                        AlertService.addStrataErrorMessage(error);
                        SearchResultsService.searchInProgress.value = false;
                    });
                } else {
                    RecommendationsService.populateRecommendations(numRecommendations).then(function () {
                        SearchResultsService.clear();
                        RecommendationsService.recommendations.forEach(function (recommendation) {
                            SearchResultsService.add(recommendation);
                        });
                        SearchResultsService.searchInProgress.value = false;
                    }, function (error) {
                        AlertService.addStrataErrorMessage(error);
                        SearchResultsService.searchInProgress.value = false;
                    });
                }
            }
        };
        CaseService.onOwnerSelectChanged = function () {
            if (CaseService.owner !== undefined) {
                CaseService.populateEntitlements(CaseService.owner);
                CaseService.populateGroups(CaseService.owner);
            }
            CaseService.validateNewCasePage1();
        };

        /**
        * Add the top sorted products to list
        */
        $scope.buildProductOptions = function(originalProductList) {
            var productOptions = [];
            var productSortList = [];
            if($scope.NEW_CASE_CONFIG.isPCM){
                $http.get($scope.NEW_CASE_CONFIG.productSortListFile).then(function (response) {
                    if (response.status === 200 && response.data !== undefined) {
                        productSortList = response.data.split(',');

                        for(var i = 0; i < productSortList.length; i++) {
                            for (var j = 0 ; j < originalProductList.length ; j++) {
                                if (productSortList[i] === originalProductList[j].code) {
                                    var sortProduct = productSortList[i];
                                    productOptions.push({
                                        value: sortProduct,
                                        label: sortProduct
                                    });
                                    break;
                                }
                            }
                        }

                        var sep = '────────────────────────────────────────';
                        if (productOptions.length > 0) {
                            productOptions.push({
                                isDisabled: true,
                                label: sep
                            });
                        }

                        angular.forEach(originalProductList, function(product){
                            productOptions.push({
                                value: product.code,
                                label: product.name
                            });
                        }, this);

                        $scope.products = productOptions;
                    } else {
                        angular.forEach(originalProductList, function(product){
                            productOptions.push({
                                value: product.code,
                                label: product.name
                            });
                        }, this);
                        $scope.products = productOptions;
                    }
                });
            } else {
                angular.forEach(originalProductList, function(product){
                    productOptions.push({
                        value: product.code,
                        label: product.name
                    });
                }, this);
                $scope.products = productOptions;
            }
        };

        /**
       * Populate the selects
       */
        $scope.initSelects = function () {
            CaseService.clearCase();
            $scope.productsLoading = true;
            strataService.products.list(securityService.loginStatus.authedUser.sso_username).then(function (products) {
                $scope.buildProductOptions(products);
                $scope.productsLoading = false;
                if (RHAUtils.isNotEmpty(NEW_DEFAULTS.product)) {
                    for(var i = 0; i < $scope.products.length; i++){
                        if($scope.products[i].label === NEW_DEFAULTS.product){
                            CaseService.kase.product = $scope.products[i].value;
                            break;
                        }
                    }
                    $scope.getRecommendations();
                    $scope.getProductVersions(CaseService.kase.product);
                }
            }, function (error) {
                AlertService.addStrataErrorMessage(error);
            });
            $scope.severitiesLoading = true;
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
            if (RHAUtils.isNotEmpty(CaseService.localStorageCache) && CaseService.localStorageCache.get(securityService.loginStatus.authedUser.sso_username))
            {
                CaseService.kase.description = CaseService.localStorageCache.get(securityService.loginStatus.authedUser.sso_username).text;
            }
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

        $scope.getLocalStorageForNewCase = function(){
            if (RHAUtils.isNotEmpty(CaseService.localStorageCache) && CaseService.localStorageCache.get(securityService.loginStatus.authedUser.sso_username))
            {
                var draftNewCase = CaseService.localStorageCache.get(securityService.loginStatus.authedUser.sso_username).text
                CaseService.kase.description = draftNewCase.description;
                CaseService.kase.summary = draftNewCase.summary;
                if(RHAUtils.isNotEmpty(draftNewCase.product))
                {
                    CaseService.kase.product = draftNewCase.product;
                    $scope.getProductVersions(CaseService.kase.product);
                }
                CaseService.kase.version = draftNewCase.version;
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
            $scope.getLocalStorageForNewCase();
        }
        $scope.authLoginSuccess = $rootScope.$on(AUTH_EVENTS.loginSuccess, function () {
            $scope.firePageLoadEvent();
            $scope.initSelects();
            $scope.initDescription();
            $scope.getLocalStorageForNewCase();
            AlertService.clearAlerts();
            RecommendationsService.failureCount = 0;
        });

        $scope.$on('$destroy', function () {
            $scope.authLoginSuccess();
        });
        /**
       * Retrieve product's versions from strata
       *
       * @param product
       */
        $scope.getProductVersions = function (product) {
            CaseService.kase.version = '';
            $scope.versionDisabled = true;
            $scope.versionLoading = true;
            strataService.products.versions(product).then(function (response) {
                response.sort(function (a, b) {  //Added because of wrong order of version for RHEL from SFDC
                    var result;
                    a = a.split('.');
                    b = b.split('.');
                    while (a.length) {
                        if (result = a.shift() - (b.shift() || 0)) {
                            return result;
                        }
                    }
                    return -b.length;
                });
                $scope.versions = response;
                CaseService.validateNewCasePage1();
                $scope.versionDisabled = false;
                $scope.versionLoading = false;
                if (RHAUtils.isNotEmpty(NEW_DEFAULTS.version)) {
                    CaseService.kase.version = NEW_DEFAULTS.version;
                    $scope.getRecommendations();
                }
            }, function (error) {
                AlertService.addStrataErrorMessage(error);
            });

            //Retrieve the product detail, basically finding the attachment artifact
            $scope.fetchProductDetail(product);
        };

        /**
        * Fetch the product details for the selected product
        **/
        $scope.fetchProductDetail = function (productCode) {
            AttachmentsService.suggestedArtifact = {};
            strataService.products.get(productCode).then(angular.bind(this, function (product) {
                if (product !== undefined && product.suggested_artifacts !== undefined && product.suggested_artifacts.suggested_artifact !== undefined) {
                    if (product.suggested_artifacts.suggested_artifact.length > 0) {
                        var description = product.suggested_artifacts.suggested_artifact[0].description;
                        if (description.indexOf('<a') > -1) {
                            description = description.replace("<a","<a target='_blank'");
                        }
                        AttachmentsService.suggestedArtifact.description = description;
                    }
                }
            }), function (error) {
                AlertService.addStrataErrorMessage(error);
            });
        };

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
            if (window.chrometwo_require !== undefined) {
                chrometwo_require(['analytics/main'], function (analytics) {
                    analytics.trigger('OpenSupportCaseSubmit', $event);
                });
            }
            /*jshint camelcase: false */
            var caseJSON = {
                    'product': CaseService.kase.product,
                    'version': CaseService.kase.version,
                    'summary': CaseService.kase.summary,
                    'description': CaseService.kase.description,
                    'severity': CaseService.kase.severity.name
                };
            if (RHAUtils.isNotEmpty(CaseService.group)) {
                caseJSON.folderNumber = CaseService.group;
            }
            if (RHAUtils.isNotEmpty(CaseService.entitlement)) {
                caseJSON.entitlement = {};
                caseJSON.entitlement.sla = CaseService.entitlement;
            }
            if (RHAUtils.isNotEmpty(CaseService.account)) {
                caseJSON.accountNumber = CaseService.account.number;
            }
            if (CaseService.fts) {
                caseJSON.fts = true;
                if (CaseService.fts_contact) {
                    caseJSON.contactInfo24X7 = CaseService.fts_contact;
                }
            }
            if (RHAUtils.isNotEmpty(CaseService.owner)) {
                caseJSON.contactSsoUsername = CaseService.owner;
            }

            $scope.submittingCase = true;
            AlertService.addWarningMessage('Creating case...');
            var redirectToCase = function (caseNumber) {
                $state.go('edit', { id: caseNumber });
                AlertService.clearAlerts();
                $scope.submittingCase = false;
            };
            strataService.cases.post(caseJSON).then(function (caseNumber) {
                AlertService.clearAlerts();
                AlertService.addSuccessMessage(translate('Successfully created case number') + ' ' + caseNumber);
                if(CaseService.localStorageCache && RHAUtils.isNotEmpty(CaseService.localStorageCache.get(securityService.loginStatus.authedUser.sso_username)))
                {
                    CaseService.localStorageCache.remove(securityService.loginStatus.authedUser.sso_username);
                }
                if ((AttachmentsService.updatedAttachments.length > 0 || AttachmentsService.hasBackEndSelections()) && NEW_CASE_CONFIG.showAttachments) {
                    AttachmentsService.updateAttachments(caseNumber).then(function () {
                        redirectToCase(caseNumber);
                    }, function (error) {
                        AlertService.addStrataErrorMessage(error);
                        $scope.submittingCase = false;
                    });
                } else if(NEW_CASE_CONFIG.showAttachments && $scope.ie8 || NEW_CASE_CONFIG.showAttachments && $scope.ie9 ) {
                    $scope.ieFileUpload(caseNumber);
                }else {
                    redirectToCase(caseNumber);
                }
            }, function (error) {
                AlertService.addStrataErrorMessage(error);
                $scope.submittingCase = false;
            });
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

        $scope.$on(CASE_EVENTS.fetchProductsForContact, function() {
            $scope.productsLoading = true;
            strataService.products.list(CaseService.owner).then(function (products) {
                $scope.buildProductOptions(products);
                $scope.productsLoading = false;
                if (RHAUtils.isNotEmpty(NEW_DEFAULTS.product)) {
                    for(var i = 0; i < $scope.products.length; i++){
                        if($scope.products[i].label === NEW_DEFAULTS.product){
                            CaseService.kase.product = $scope.products[i].value;
                            break;
                        }
                    }
                    $scope.getRecommendations();
                    $scope.getProductVersions(CaseService.kase.product);
                }
            }, function (error) {
                AlertService.addStrataErrorMessage(error);
            });
        });
    }
]);
