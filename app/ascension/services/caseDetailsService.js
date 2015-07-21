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
    '$angularCacheFactory',
    function (udsService, AlertService, strataService, RHAUtils, securityService, RoutingService, AccountService, UQL, $rootScope, TOPCASES_EVENTS, $q, gettextCatalog,$angularCacheFactory) {
        $angularCacheFactory('localCache', {
            storageMode: 'localStorage',
            verifyIntegrity: true
        });

		this.caseDetailsLoading = true;
        this.yourCasesLoading = true;
        this.caseClosing = false;
		this.kase = {};
        this.prestineKase = {};
        this.cases = {};
        this.bugzillas = [];
        this.publicComments = [];
        this.privateComments = [];
        this.liveChatTranscripts=[];
        this.bomgarSessions=[];
        this.products = [];
        this.versions = [];
        this.severities = [];
        this.statuses = [];
        this.disableAddComment = true;
        this.isCommentPrivate = false;
        this.caseHistory = [];
        this.versionDisabled = false;
        this.updatedNotifiedUsers = [];
        this.yourCasesLimit = 6;
        this.fetchingCaseHistory = false;
        this.fetchingCaseComments = false;
        this.noOfContributors = 0;
        this.noOfObservers = 0;
        this.discussionElements = [];
        this.enggBackLogCases = {};
        this.draftComment = {};
        this.draftCommentOnServerExists=false;
        this.commentText = '';
        this.isLoggedInUserIsOwner = false;
        this.localStorageCache = $angularCacheFactory.get('localCache');
        this.lockFlag = false;
        this.slockFlag=false;
        this.foundEnggBacklogRole = false;
//        this.slockFlag = false;
        this.loggedInUserId = '';
        this.myLockedCases = [];

        this.lockCase = function(){
            this.slockFlag = true;
            if(this.lockFlag == true) {
                udsService.kase.lock.delete(this.kase.case_number).then(angular.bind(this, function (response){
                    this.lockFlag = false;
                    this.slockFlag = false;
                    this.myLockedCases = [];
                }),angular.bind(this, function (error) {
                    AlertService.addUDSErrorMessage(error);
                    this.lockFlag = true;
                    this.slockFlag = false;

                }));
            } else {
                if(this.myLockedCases.length > 0 && RHAUtils.isNotEmpty(this.myLockedCases[0])) {
                    AlertService.addInfoMessage(gettextCatalog.getString("You already have one locked case please unlock it first."));
                    this.slockFlag = false;
                } else {
                    udsService.kase.lock.get(this.kase.case_number).then(angular.bind(this, function (response){
                        this.lockFlag = true;
                        this.slockFlag = false;
                    }),angular.bind(this, function (error) {
                        AlertService.addUDSErrorMessage(error);
                        this.lockFlag = false;
                        this.slockFlag = false;
                    }));
                }
            }
        };

        this.getCaseDetails = function(caseNumber) {
            AccountService.accountDetailsLoading = true;
            this.caseDetailsLoading = true;
            var deferred = $q.defer();
            udsService.kase.details.get(caseNumber).then(angular.bind(this, function (response) {
                this.kase = response;
                this.draftComment = {};
                this.draftCommentOnServerExists=false;
                this.commentText='';
                if(this.kase.externalLock === undefined){
                    this.lockFlag = false;
                } else {
                    this.lockFlag = true;
                }
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
                        this.kase.negotiatedEntitlement.active_flag =  gettextCatalog.getString("Yes");

                    }
                    else {
                        this.kase.negotiatedEntitlement.active_flag = gettextCatalog.getString("No");
                    }
                    if (this.kase.negotiatedEntitlement.life_Case === true) {
                        this.kase.negotiatedEntitlement.life_Case_flag = gettextCatalog.getString("Yes");
                    }
                    else {
                        this.kase.negotiatedEntitlement.life_Case_flag = gettextCatalog.getString("No");
                    }
                    if (this.kase.negotiatedEntitlement.violates_sla === true) {
                        this.kase.negotiatedEntitlement.violates_sla_flag =gettextCatalog.getString("Yes");
                    }
                    else {
                        this.kase.negotiatedEntitlement.violates_sla_flag = gettextCatalog.getString("No");;
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
                self.isLoggedInUserIsOwner = false;
                //when case owner is 'New Case Queue' , we dont get kase.owner field from UDS
                if(RHAUtils.isNotEmpty(this.kase.owner)) {
                    //we have to iterate for sso, as one user can have multiple sso in the UDS response
                    angular.forEach(this.kase.owner.resource.sso, function (ssoName) {
                        if (securityService.loginStatus.authedUser.sso_username === ssoName) {
                            self.isLoggedInUserIsOwner = true;
                        }
                    });
                }
                angular.copy(this.kase, this.prestineKase);
                $rootScope.$broadcast(TOPCASES_EVENTS.caseDetailsFetched);
                this.caseDetailsLoading = false;
                deferred.resolve();
            }), angular.bind(this, function (error) {
                AlertService.addUDSErrorMessage(error);
                AccountService.accountDetailsLoading = false;
                this.caseDetailsLoading = false;
                deferred.reject(error);
            }));
            return deferred.promise;
        };

        this.checkForCaseStatusToggleOnAttachOrComment = function(){
            var status = {};
            if (!securityService.loginStatus.authedUser.is_internal && this.kase.status.name === 'Closed') {
                status = { name: 'Waiting on Red Hat' };
                this.kase.status = status;
            }

            if(securityService.loginStatus.authedUser.is_internal){
                if (this.kase.status.name === 'Waiting on Red Hat') {
                    status = { name: 'Waiting on Customer' };
                    this.kase.status = status;
                }
            }else {
                if (this.kase.status.name === 'Waiting on Customer') {
                    status = { name: 'Waiting on Red Hat' };
                    this.kase.status = status;
                }
            }
        };

        this.extractRoutingRoles = function(user) {
            var roleNames, _ref;
            roleNames = [];
            var self = this;
            angular.forEach(user, function(u) {
                if ((u != null ? (_ref = u.resource.roles) != null ? _ref.length : void 0 : void 0) > 0) {
                    angular.forEach(u.resource.roles, function (r) {
                        if (RoutingService.mapping[r.resource.name.toLowerCase()] != null) {
                            if(r.resource.name.toLowerCase() === 'ascension-engg-backlog'){
                                self.foundEnggBacklogRole = true;
                            } else {
                                return roleNames.push(r.resource.name.toLowerCase());
                            }
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
            ssoUserName = securityService.loginStatus.authedUser.sso_username;
            var userUql = UQL.cond('SSO','is',"\""+ ssoUserName + "\"");
            udsService.user.get(userUql).then(angular.bind(this, function (user){
                //TODO should search fur contact first then default to user
                //var user = userArr[0];
                if ((user == null) || ((user != null ? user[0].externalModelId : void 0) == null)) {
                    AlertService.addDangerMessage(gettextCatalog.getString("Was not able to fetch user with given ssoUserName"));
                }
                else{
                    this.loggedInUserId = user[0].externalModelId;
                    userRoles = self.extractRoutingRoles(user);
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
                        finalUql = UQL.or(finalUql,RoutingService.mapping[r](user[0]));
                    });

                    var secureHandlingUQL = UQL.cond('requiresSecureHandling', 'is', false);
                    finalUql = UQL.and(finalUql, secureHandlingUQL);

                    var notLockedCaseUQL = UQL.cond('hasExternalLock', 'is', false);
                    finalUql = UQL.and(finalUql, notLockedCaseUQL);

                    var promise = udsService.cases.list(finalUql,'Minimal',this.yourCasesLimit, undefined, true);
                    promise.then(angular.bind(this, function (topCases) {
                        if(RHAUtils.isNotEmpty(topCases)) {
                            //sort cases based on collab score .even though we are getting top cases, just to display in proper order
                            topCases.sort(function (a, b) {
                                return b.resource.collaborationScore - a.resource.collaborationScore;
                            });
                            if(this.foundEnggBacklogRole) {
                                this.getEnggBackLogCases().then( angular.bind(this, function (response) {
                                    if (!RHAUtils.isObjectEmpty(this.enggBackLogCases)) {
                                        topCases = topCases.slice(0, this.yourCasesLimit - 1); //if engineering backlog case is found, we will append at end and slice top 5 cases
                                        topCases.push(this.enggBackLogCases[0]);
                                    }
                                    this.cases = topCases;
                                    //if case is not yet viewed, then get the first case details
                                    if(RHAUtils.isObjectEmpty(this.kase)) {
                                        //get details for first top case
                                        $rootScope.$broadcast(TOPCASES_EVENTS.initialCaseLoad);
                                    }
                                }),function (error) {
                                    AlertService.clearAlerts();
                                    AlertService.addUDSErrorMessage(error);
                                });

                            }else{
                                this.cases = topCases;
                                //if case is not yet viewed, then get the first case details
                                if(RHAUtils.isObjectEmpty(this.kase)) {
                                    //get details for first top case
                                    $rootScope.$broadcast(TOPCASES_EVENTS.initialCaseLoad);
                                }
                            }
                            //Fetch the locked cases for the logged in user
                            this.getMylockedCases().then( angular.bind(this, function (response) {
                                if(this.myLockedCases.length > 0 && RHAUtils.isNotEmpty(this.myLockedCases[0])) {
                                    //Append the locked case at the beginning of top cases after removing the last case
                                    topCases.splice((topCases.length - 2),1);
                                    topCases.splice(0,0,this.myLockedCases[0]);
                                }
                                self.cases = topCases;
                                //if case is not yet viewed, then get the first case details
                                if(RHAUtils.isObjectEmpty(self.kase)) {
                                    //get details for first top case
                                    $rootScope.$broadcast(TOPCASES_EVENTS.initialCaseLoad);
                                }
                            }), function (error) {
                                AlertService.addStrataErrorMessage(error);
                            });
                        }else {
                            AlertService.clearAlerts();
                            AlertService.addInfoMessage(gettextCatalog.getString("No cases found."));
                        }
                        self.yourCasesLoading = false;

                    }), function (error) {
                        AlertService.clearAlerts();
                        AlertService.addUDSErrorMessage(error);
                        self.yourCasesLoading = false;
                    });
                }
            }),angular.bind(this, function (error) {
                    AlertService.clearAlerts();
                    AlertService.addUDSErrorMessage(error);
                    self.yourCasesLoading = false;
                })
            );
		};

        this.getEnggBackLogCases = function(){
            var uqlEnggBacklog;
            var self = this;
            uqlEnggBacklog = RoutingService.ENGG_BACKLOG();
            var secureHandlingUQL = UQL.cond('requiresSecureHandling', 'is', false);
            uqlEnggBacklog = UQL.and(uqlEnggBacklog, secureHandlingUQL);
            //as we just want one top case for engineering backlog, passing limit as only 1 and we want oldest lastModified case
            var sortOption = 'lastModifiedDate asc';
            var deferred = $q.defer();
            udsService.cases.list(uqlEnggBacklog,'Minimal',1,sortOption,true).then(angular.bind(this, function (backlogCases) {
                if(RHAUtils.isNotEmpty(backlogCases)) {
                    self.enggBackLogCases = backlogCases;
                }else {
                    AlertService.clearAlerts();
                    AlertService.addInfoMessage(gettextCatalog.getString("No engineering backlog cases found."));
                }
                deferred.resolve();
            }), function (error) {
                AlertService.clearAlerts();
                AlertService.addUDSErrorMessage(error);
                deferred.reject(error);
            });
            return deferred.promise;
        };

        this.getMylockedCases = function() {
            var hasLockedUQL = UQL.cond('hasExternalLock', 'is', true);
            var externalLockCreatedByUQL = UQL.cond('externalLockCreatedById', 'is', "\"" + this.loggedInUserId + "\"");
            var lockedCasesUQL = UQL.and(hasLockedUQL, externalLockCreatedByUQL);
            var deferred = $q.defer();
            udsService.cases.list(lockedCasesUQL,'Minimal',1,null,false).then(angular.bind(this, function (lockedCases) {
                if(RHAUtils.isNotEmpty(lockedCases)) {
                    this.myLockedCases = lockedCases;
                }
                deferred.resolve();
            }), function (error) {
                this.myLockedCases = [];
                AlertService.clearAlerts();
                AlertService.addUDSErrorMessage(error);
                deferred.reject(error);
            });
            return deferred.promise;
        };

        this.closeCase = function() {
            this.caseClosing = true;
            this.kase.status.name = 'Closed';
            var promise = this.updateCaseDetails();
            promise.then( angular.bind(this, function (response) {
                this.caseClosing = false;
                AlertService.addSuccessMessage(gettextCatalog.getString('Case {{caseNumber}} successfully closed.',{caseNumber:this.kase.case_number}));
                this.getCaseDetails(this.kase.case_number);
            }), function (error) {
                this.caseClosing = false;
                this.kase.status.name = this.prestineKase.status.name;
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


        this.populateComments = function (caseNumber) {
            this.bugzillas=[];
            this.liveChatTranscripts=this.kase.liveChatTranscripts;
            this.bomgarSessions=this.kase.bomgarSessions;
            this.publicComments=[];
            this.privateComments=[];
            var promise = udsService.kase.comments.get(caseNumber);
            promise.then(angular.bind(this, function (comments) {
                angular.forEach(comments, angular.bind(this, function (comment, index) {
                    if (comment.resource.draft === true) {
                        this.draftComment = comment;
                        this.draftCommentOnServerExists=true;
                        this.commentText = comment.text;
                        this.isCommentPrivate = !comment.resource.public;
                        if (RHAUtils.isNotEmpty(this.commentText)) {
                            this.disableAddComment = false;
                        } else if (RHAUtils.isEmpty(this.commentText)) {
                            this.disableAddComment = true;
                        }
                        // comments.slice(index, index + 1);
                    } else if(comment.resource.issueLink !== undefined && comment.resource.issueLink.resource.source === 'Bugzilla'){
                        this.bugzillas.push(comment);
                    } else if(comment.resource.text && comment.resource.public){
                        this.publicComments.push(comment);
                    } else if(comment.resource.text && !comment.resource.public){
                        this.privateComments.push(comment);
                    }
                }));
                if(this.localStorageCache) {
                    if (this.localStorageCache.get(caseNumber+securityService.loginStatus.authedUser.sso_username))
                    {
                        this.draftComment = this.localStorageCache.get(caseNumber+securityService.loginStatus.authedUser.sso_username);
                        this.commentText = this.draftComment.text;
                        this.isCommentPrivate = !this.draftComment.public;
                        if (RHAUtils.isNotEmpty(this.commentText)) {
                            this.disableAddComment = false;
                        } else if (RHAUtils.isEmpty(this.commentText)) {
                            this.disableAddComment = true;
                        }
                    }
                }
                //this.comments = comments;
            }), function (error) {
                AlertService.addUDSErrorMessage(error);
            });
            return promise;
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
            strataService.cases.put(this.getEightDigitCaseNumber(this.kase.case_number), caseJSON).then(angular.bind(this, function () {
                this.updatingCase = false;
                angular.copy(this.kase, this.prestineKase);
                deferred.resolve();
            }), function (error) {
                this.updatingCase = false;
                deferred.reject(error);
            });
            return deferred.promise;
        };
        this.updateCaseDetails = function(){
            var deferred = $q.defer();
            var caseJSON = {
                resource : {}
            };
            var self = true;
            if (this.kase.summary !== undefined && this.kase.summary.summaryText !== undefined && !angular.equals(this.prestineKase.summary.summaryText, this.kase.summary.summaryText)) {
                var caseSummary = {
                    resource : {
                        summary: this.kase.summary.summaryText
                    }
                };
                caseJSON.resource.caseSummary = caseSummary;
            }
            if (this.kase.status !== undefined && this.kase.status.name !== undefined && !angular.equals(this.prestineKase.status.name, this.kase.status.name)) {
                caseJSON.resource.status = this.kase.status.name;
            }
            udsService.kase.details.put(this.kase.case_number, caseJSON).then(angular.bind(this, function () {
                angular.copy(self.kase, self.prestineKase);
                deferred.resolve();
            }), function (error) {
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

        // Appending a '0' to the case number because strata needs that
        // and UDS trims, as UDS consider it as number while strata consider it as string
        this.getEightDigitCaseNumber = function(caseNumber){
            var validCaseNumber = '',i;
            if(caseNumber.toString().length < 8) {
                var noOfZero = 8 - caseNumber.toString().length;
                for(i=0;i<noOfZero;i++){
                    validCaseNumber = validCaseNumber+'0';
                }
                validCaseNumber = validCaseNumber+caseNumber;
            }
            return validCaseNumber;
        };
        this.takeOwnership = function(){
            var newOwner = securityService.loginStatus.authedUser.sso_username;
            var self = this;
            strataService.cases.owner.update(this.getEightDigitCaseNumber(this.kase.case_number),newOwner).then(function () {
                //rather than just assigning kase.owner.resource.fullName, take the user details from UDS and assign it to kase.owner
                var ssoUserName = securityService.loginStatus.authedUser.sso_username;
                var userUql = UQL.cond('SSO','is',"\""+ ssoUserName + "\"");
                var promise = udsService.user.get(userUql).then(angular.bind(this, function (user){
                    if ((user == null) || ((user != null ? user[0].externalModelId : void 0) == null)) {
                        AlertService.addDangerMessage(gettextCatalog.getString("Was not able to fetch user with given ssoUserName"));
                    }
                    else{
                        self.kase.owner = user[0];
                    }
                    }),angular.bind(this, function (error) {
                    AlertService.clearAlerts();
                    AlertService.addUDSErrorMessage(error);
                    self.yourCasesLoading = false;
                }));
                // var promise = udsService.user.details(newOwner);
                // promise.then(angular.bind(this, function (user) {
                //     if(RHAUtils.isNotEmpty(user)) {
                //         self.kase.owner = user[0];
                //     }
                // }), function (error) {
                //     AlertService.addUDSErrorMessage(error);
                // });
                self.isLoggedInUserIsOwner = true;
            }, function (error) {
                AlertService.addStrataErrorMessage(error);
            });
        };
	}
]);
