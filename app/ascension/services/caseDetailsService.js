'use strict';
/*jshint camelcase: false */
angular.module('RedhatAccess.ascension').service('CaseDetailsService', [
    'udsService',
    'AlertService',
    'strataService',
    'RHAUtils',
    'securityService',
    'RoutingService',
    'AccountService',
    'UQL',
    '$rootScope',
    'TOPCASES_EVENTS',
    '$q',
    'gettextCatalog',
    function (udsService, AlertService, strataService, RHAUtils, securityService, RoutingService, AccountService, UQL, $rootScope, TOPCASES_EVENTS, $q, gettextCatalog) {
		this.caseDetailsLoading = true;
        this.yourCasesLoading = true;
        this.caseClosing = false;
		this.kase = {};
        this.prestineKase = {};
        this.cases = {};
        this.products = [];
        this.versions = [];
        this.severities = [];
        this.statuses = [];
        this.caseHistory = [];
        this.versionDisabled = false;
        this.yourCasesLimit = 6;
        this.fetchingCaseHistory = false;
        this.noOfContributors = 0;
        this.noOfObservers = 0;

        this.getCaseDetails = function(caseNumber) {
            AccountService.accountDetailsLoading = true;
            this.caseDetailsLoading = true;
            udsService.kase.details.get(caseNumber).then(angular.bind(this, function (response) {
                this.kase = response;
                if((this.kase.sbt===undefined) && (this.kase.status.name=="Waiting on Red Hat"))
                {
                    this.kase.sbtState=gettextCatalog.getString("MISSING SBT. "+"Entitlement status: {{entitlementStatus}}",{entitlementStatus:this.kase.entitlement.status});

                }
                else {
                    if ((this.kase.sbt < 0) && (this.kase.status.name == "Waiting on Red Hat")) {
                        ///Noun
                        this.kase.sbtState = gettextCatalog.getString("BREACH");
                    }
                    else {
                        if (this.kase.status.name == "Closed") {
                            ///N/A stands for Not Applicable
                            this.kase.sbtState = gettextCatalog.getString("N/A");
                        }
                        else {
                            if (this.kase.sbt > 0) {
                                ///Noun
                                this.kase.sbtState = gettextCatalog.getString("NOT BREACHED");
                            }
                            else {
                                if (this.kase.status.name == "Waiting on Customer") {
                                    this.kase.sbtState = gettextCatalog.getString("NONE");
                                }
                            }

                        }
                    }
                }
                if(this.kase.negotiatedEntitlement) {
                    if (this.kase.negotiatedEntitlement.active === true) {
                        this.kase.negotiatedEntitlement.active_flag = "Yes";
                    }
                    else {
                        this.kase.negotiatedEntitlement.active_flag = "No";
                    }
                    if (this.kase.negotiatedEntitlement.life_Case === true) {
                        this.kase.negotiatedEntitlement.life_Case_flag = "Yes";
                    }
                    else {
                        this.kase.negotiatedEntitlement.life_Case_flag = "No";
                    }
                    if (this.kase.negotiatedEntitlement.violates_sla === true) {
                        this.kase.negotiatedEntitlement.violates_sla_flag = "Yes";
                    }
                    else {
                        this.kase.negotiatedEntitlement.violates_sla_flag = "No";
                    }
                    var startTime = RHAUtils.convertToTimezone(this.kase.negotiatedEntitlement.start_time);
                    this.kase.negotiatedEntitlement.format_start_time = RHAUtils.formatDate(startTime, 'MMM DD YYYY hh:mm A Z');
                    var targetDate = RHAUtils.convertToTimezone(this.kase.negotiatedEntitlement.target_date);
                    this.kase.negotiatedEntitlement.format_target_date = RHAUtils.formatDate(targetDate, 'MMM DD YYYY hh:mm A Z');
                }
                var self = this;
                //we need to reset it before getting actual number from current case
                self.noOfContributors = 0;
                self.noOfObservers = 0;
                angular.forEach(this.kase.caseAssociates, function(associate) {
                    if(associate.resource.role === 'Contributor'){
                        self.noOfContributors = self.noOfContributors + 1;
                        self.kase.contributors.push(associate.resource.associate.resource.fullName);
                    }else if(associate.resource.role === 'Observer'){
                        self.noOfObservers = self.noOfObservers + 1;
                        self.kase.observers.push(associate.resource.associate.resource.fullName);
                    }
                });
                angular.copy(this.kase, this.prestineKase);
                $rootScope.$broadcast(TOPCASES_EVENTS.caseDetailsFetched);
                this.caseDetailsLoading = false;
            }), angular.bind(this, function (error) {
                AlertService.addUDSErrorMessage(error);
                this.caseDetailsLoading = false;
            }));
        };

        this.extractRoutingRoles = function(user) {
            var roleNames, _ref;
            roleNames = [];
            angular.forEach(user, function(u) {
                if ((u != null ? (_ref = u.resource.roles) != null ? _ref.length : void 0 : void 0) > 0) {
                    angular.forEach(u.resource.roles, function (r) {
                        if (RoutingService.mapping[r.resource.name.toLowerCase()] != null) {
                            return roleNames.push(r.resource.name.toLowerCase());
                        }
                    });
                }
            });
            return roleNames;
        };
		this.getYourCases = function() {
            var uql, userRoles, ssoUserName, uqlParts,finalUql;
            uqlParts = [];
            var self = this;
            ssoUserName = securityService.loginStatus.authedUser.sso_username+"\"";
            udsService.user.get("SSO is \"" + ssoUserName + "\"").then(angular.bind(this, function (user){
                if ((user == null) || ((user != null ? user[0].externalModelId : void 0) == null)) {
                    AlertService.addDangerMessage(gettextCatalog.getString("Was not able to fetch user given ssoUserName"));
                }
                else{
                    userRoles = this.extractRoutingRoles(user);

                    if ((userRoles != null ? userRoles.length : void 0) > 0) {
                    //        console.log("Discovered roles on the user: " + userRoles);
                    //}else if (user.sbrs == null) {
                    //    console.log("No sbrs found on user.");
                    //    userRoles = [RoutingService.key_mapping.OWNED_CASES];
                    } else {
                        AlertService.clearAlerts();
                        AlertService.addInfoMessage(gettextCatalog.getString("No url roles or user roles found."));
                        userRoles = [RoutingService.key_mapping.OWNED_CASES, RoutingService.key_mapping.COLLABORATION, RoutingService.key_mapping.FTS];
                    }
                    angular.forEach(userRoles, function(r){
                        uqlParts.push(RoutingService.mapping[r](user[0]));
                    });
                    finalUql = uqlParts.join(' or ');

                    var secureHandlingUQL = UQL.cond('requiresSecureHandling', 'is', false);
                    finalUql = UQL.and(finalUql, secureHandlingUQL);

                    var promise = udsService.cases.list(finalUql,'Minimal',this.yourCasesLimit);
                    promise.then(angular.bind(this, function (topCases) {
                        if(RHAUtils.isNotEmpty(topCases)) {
                            //sort cases based on collab score even though we are getting top cases, just to display in proper order
                            topCases.sort(function (a, b) {
                                return b.resource.collaborationScore - a.resource.collaborationScore;
                            });
                            self.cases = topCases;
                            //if case is not yet viewed, then get the first case details
                            if(RHAUtils.isObjectEmpty(self.kase)) {
                                //get details for first top case
                                self.getCaseDetails(topCases[0].resource.caseNumber);
                            }
                        }else {
                            AlertService.clearAlerts();
                            AlertService.addInfoMessage(gettextCatalog.getString("No cases found."));
                        }
                        self.yourCasesLoading = false;

                    }), function (error) {
                        AlertService.addUDSErrorMessage(error);
                        self.yourCasesLoading = false;
                    });
                }
            }),angular.bind(this, function (error) {
                    AlertService.addUDSErrorMessage(error);
                    self.yourCasesLoading = false;
                })
            );
		};

        this.closeCase = function() {
            this.caseClosing = true;
            // Appending a '0' to the case number because strata needs that
            // and UDS trims that
            var caseNumber = '';
            if(this.kase.case_number.toString().length < 8) {
                caseNumber = '0'+this.kase.case_number;
            }
            var promise = strataService.cases.put(caseNumber, {status: 'Closed'});
            promise.then( angular.bind(this, function (response) {
                this.caseClosing = false;
                AlertService.addSuccessMessage(gettextCatalog.getString('Case {{caseNumber}} successfully closed.',{caseNumber:this.kase.case_number}));
                this.kase.status.name = 'Closed';
            }), function (error) {
                this.caseClosing = false;
                AlertService.addStrataErrorMessage(error);
            });
        };

        this.fetchProducts = function() {
            strataService.products.list(securityService.loginStatus.authedUser.sso_username).then(angular.bind(this, function(response) {
                this.products = response;
                if(RHAUtils.isNotEmpty(this.kase.product)) {
                    this.getVersions(this.kase.product);
                }
            }), function (error) {
                AlertService.addStrataErrorMessage(error);
            });
        };

        this.getVersions = function(product) {
            this.versionDisabled = true;
            strataService.products.versions(product).then(angular.bind(this, function (response) {
                response.sort(function (a, b) { //Added because of wrong order of versions
                    a = a.split('.');
                    b = b.split('.');
                    for( var i = 0; i < a.length; i++){
                        if(a[i] < b[i]){
                            return 1;
                        } else if(b[i] < a[i]){
                            return -1;
                        }
                    }
                    if(a.length > b.length){
                        return 1;
                    } else if (b.length > a.length){
                        return -1;
                    }
                    return 0;
                });
                this.versions = response;
                this.versionDisabled = true;
            }), function (error) {
                this.versionDisabled = true;
                AlertService.addStrataErrorMessage(error);
            });
        };

        this.fetchSeverities = function() {
            strataService.values.cases.severity().then(angular.bind(this, function (response) {
                this.severities = response;
            }), function (error) {
                AlertService.addStrataErrorMessage(error);
            });
        };

        this.fetchStatuses = function() {
            strataService.values.cases.status().then(angular.bind(this, function (response) {
                this.statuses = response;
            }), function (error) {
                AlertService.addStrataErrorMessage(error);
            });
        };

        this.updateCase = function(){
            this.updatingCase = true;
            var deferred = $q.defer();
            var caseJSON = {};
            if (this.kase.type !== undefined && !angular.equals(this.prestineKase.type, this.kase.type)) {
                caseJSON.type = this.kase.type.name;
            }
            if (this.kase.severity !== undefined && !angular.equals(this.prestineKase.severity, this.kase.severity)) {
                caseJSON.severity = this.kase.severity.name;
            }
            if (this.kase.status !== undefined && !angular.equals(this.prestineKase.status, this.kase.status)) {
                caseJSON.status = this.kase.status.name;
            }
            if (this.kase.product !== undefined && !angular.equals(this.prestineKase.product, this.kase.product)) {
                caseJSON.product = this.kase.product;
            }
            if (this.kase.version !== undefined && !angular.equals(this.prestineKase.version, this.kase.version)) {
                caseJSON.product = this.kase.product;
                caseJSON.version = this.kase.version;
            }
            // Appending a '0' to the case number because strata needs that
            // and UDS trims that
            var caseNumber = '';
            if(this.kase.case_number.toString().length < 8) {
                caseNumber = '0'+this.kase.case_number;
            }
            strataService.cases.put(caseNumber, caseJSON).then(angular.bind(this, function () {
                this.updatingCase = false;
                angular.copy(this.kase, this.prestineKase);
                deferred.resolve();
            }), function (error) {
                this.updatingCase = false;
                deferred.reject(error);
            });
            return deferred.promise;
        };

        this.fetCaseHistory = function(caseNumber) {
            this.fetchingCaseHistory = true;
            var promise = udsService.kase.history.get(caseNumber);
            promise.then(angular.bind(this, function (caseHistory) {
                if(RHAUtils.isNotEmpty(caseHistory)) {
                    this.caseHistory = caseHistory;
                }
                this.caseHistory.sort(function(a,b) {
                    a = new Date(a.resource.created);
                    b = new Date(b.resource.created);
                    return a-b;
                });
                this.fetchingCaseHistory = false;
            }), function (error) {
                this.fetchingCaseHistory = false;
                AlertService.addUDSErrorMessage(error);
            });
        };
	}
]);
