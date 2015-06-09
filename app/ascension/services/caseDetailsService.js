'use strict';
/*jshint camelcase: false */
angular.module('RedhatAccess.ascension').service('CaseDetailsService', [
    'udsService',
    'AlertService',
    'RHAUtils',
    'securityService',
    'RoutingService',
    'AccountService',
    'UQL',
    '$rootScope',
    'TOPCASES_EVENTS',
    function (udsService, AlertService, RHAUtils,securityService, RoutingService,AccountService,UQL,$rootScope,TOPCASES_EVENTS) {
		this.caseDetailsLoading = true;
        this.yourCasesLoading = true;
		this.kase = {};
        this.cases = {};

        this.getCaseDetails = function(caseNumber) {
            AccountService.accountDetailsLoading = true;
            this.caseDetailsLoading = true;
            udsService.kase.details.get(caseNumber).then(angular.bind(this, function (response) {
                this.kase = response;
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
                    AlertService.addDangerMessage("Was not able to fetch user given ssoUserName");
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
                        AlertService.addInfoMessage("No url roles or user roles found.");
                        userRoles = [RoutingService.key_mapping.OWNED_CASES, RoutingService.key_mapping.COLLABORATION, RoutingService.key_mapping.FTS];
                    }
                    angular.forEach(userRoles, function(r){
                        uqlParts.push(RoutingService.mapping[r](user[0]));
                    });
                    finalUql = uqlParts.join(' or ');

                    var secureHandlingUQL = UQL.cond('requiresSecureHandling', 'is', false);
                    finalUql = UQL.and(finalUql, secureHandlingUQL);

                    var promise = udsService.cases.list(finalUql,'Minimal');
                    promise.then(angular.bind(this, function (topCases) {
                        if(RHAUtils.isNotEmpty(topCases)) {
                            //sort cases based on collab score
                            topCases.sort(function (a, b) {
                                return b.resource.collaborationScore - a.resource.collaborationScore;
                            });
                            //slice top 6 cases for display
                            self.cases = topCases.slice(0, 6);
                            //if case is not yet viewed, then get the first case details
                            if(RHAUtils.isObjectEmpty(self.kase)) {
                                //get details for first top case
                                self.getCaseDetails(topCases[0].resource.caseNumber);
                            }
                        }else {
                            AlertService.clearAlerts();
                            AlertService.addInfoMessage("No cases found.");
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
	}
]);
