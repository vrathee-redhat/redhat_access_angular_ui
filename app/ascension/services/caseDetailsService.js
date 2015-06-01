'use strict';
/*jshint camelcase: false */
angular.module('RedhatAccess.ascension').service('CaseDetailsService', [
    'udsService',
    'AlertService',
    'RHAUtils',
    'securityService',
    'RoutingService',
    'UQL',
    function (udsService, AlertService, RHAUtils,securityService, RoutingService,UQL) {
		this.caseDetailsLoading = false;
        this.yourCasesLoading = true;
		this.kase = {};
        this.cases = {};

		this.getCaseDetails = function(caseNumber) {
			this.caseDetailsLoading = true;
			udsService.kase.details.get(caseNumber).then(angular.bind(this, function (response) {
				this.kase = response;
				this.caseDetailsLoading = false;
			}), angular.bind(this, function (error) {
				AlertService.addUDSErrorMessage(error);
				this.caseDetailsLoading = false;
	        }));
		};

        this.extractRoutingRoles = function(user) {
            var roleNames, _ref;
            roleNames = [];
            if ((user != null ? (_ref = user.roles) != null ? _ref.length : void 0 : void 0) > 0) {
                angular.forEach(user.roles, function(r) {
                    if (RoutingService.mapping[r.resource.name.toLowerCase()] != null) {
                        return roleNames.push(r.resource.name.toLowerCase());
                    }
                });
            }
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
                    userRoles = this.extractRoutingRoles(user[0].resource);
                    if ((userRoles != null ? userRoles.length : void 0) > 0) {
                            //console.log("Discovered roles on the user: " + userRoles);
                    //}else if (user.sbrs == null) {
                    //    console.log("No sbrs found on user.");
                    //    userRoles = [RoutingService.key_mapping.OWNED_CASES];
                    } else {
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
                            //get details for first top case
                            self.getCaseDetails(topCases[0].resource.caseNumber);
                        }else {
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
