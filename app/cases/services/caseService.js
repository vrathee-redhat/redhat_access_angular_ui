'use strict';
/*jshint camelcase: false */
angular.module('RedhatAccess.cases').constant('CASE_GROUPS', {
    manage: 'manage',
    ungrouped: 'ungrouped'
}).service('CaseService', [
    'strataService',
    'AlertService',
    'RHAUtils',
    'securityService',
    '$q',
    '$timeout',
    '$filter',
    function (strataService, AlertService, RHAUtils, securityService, $q, $timeout, $filter) {
        this.kase = {};
        this.caseDataReady = false;
        this.isCommentPublic = false;
        this.versions = [];
        this.products = [];
        //this.statuses = [];
        this.severities = [];
        this.groups = [];
        this.users = [];
        this.comments = [];
        this.originalNotifiedUsers = [];
        this.updatedNotifiedUsers = [];
        this.account = {};
        this.draftComment = {};
        this.commentText = '';
        this.escalationCommentText = '';
        this.status = '';
        this.severity = '';
        this.type = '';
        this.group = '';
        this.owner = '';
        this.product = '';
        this.bugzillaList = {};
        this.onSelectChanged = null;
        this.onOwnerSelectChanged = null;
        this.onGroupSelectChanged = null;
        this.groupOptions = [];
        this.showsearchoptions = false;
        this.disableAddComment = true;
        /**
       * Add the necessary wrapper objects needed to properly display the data.
       *
       * @param rawCase
       */
        this.defineCase = function (rawCase) {
            /*jshint camelcase: false */
            rawCase.severity = { 'name': rawCase.severity };
            rawCase.status = { 'name': rawCase.status };
            rawCase.product = { 'name': rawCase.product };
            rawCase.group = { 'number': rawCase.folder_number };
            rawCase.type = { 'name': rawCase.type };
            this.kase = rawCase;
            this.bugzillaList = rawCase.bugzillas;
            this.caseDataReady = true;
        };
        this.setCase = function (jsonCase) {
            this.kase = jsonCase;
            this.bugzillaList = jsonCase.bugzillas;
            this.caseDataReady = true;
        };
        this.defineAccount = function (account) {
            this.account = account;
        };
        this.defineNotifiedUsers = function () {
            /*jshint camelcase: false */
            this.updatedNotifiedUsers.push(this.kase.contact_sso_username);
            //hide the X button for the case owner
            $('#rha-emailnotifyselect').on('change', angular.bind(this, function () {
                $('rha-emailnotifyselect .select2-choices li:contains("' + this.kase.contact_sso_username + '") a').css('display', 'none');
                $('rha-emailnotifyselect .select2-choices li:contains("' + this.kase.contact_sso_username + '")').css('padding-left', '5px');
            }));
            if (RHAUtils.isNotEmpty(this.kase.notified_users)) {
                angular.forEach(this.kase.notified_users.link, angular.bind(this, function (user) {
                    this.originalNotifiedUsers.push(user.sso_username);
                }));
                this.updatedNotifiedUsers = this.updatedNotifiedUsers.concat(this.originalNotifiedUsers);
            }
        };
        this.getGroups = function () {
            return this.groups;
        };
        this.clearCase = function () {
            this.caseDataReady = false;
            this.isCommentPublic = false;
            this.kase = {};
            this.versions = [];
            this.products = [];
            this.statuses = [];
            this.severities = [];
            this.groups = [];
            this.account = {};
            this.comments = [];
            this.bugzillaList = {};
            this.draftComment = undefined;
            this.commentText = undefined;
            this.escalationCommentText = undefined;
            this.status = undefined;
            this.severity = undefined;
            this.type = undefined;
            this.group = undefined;
            this.owner = undefined;
            this.product = undefined;
            this.originalNotifiedUsers = [];
            this.updatedNotifiedUsers = [];
            this.groupOptions = [];
        };
        this.groupsLoading = false;
        this.populateGroups = function (ssoUsername) {
            var that = this;
            var deferred = $q.defer();
            this.groupsLoading = true;
            var username = ssoUsername;
            if(username === undefined){
                username = securityService.loginStatus.ssoName;
            }
            strataService.groups.list(ssoUsername).then(angular.bind(this, function (groups) {
                that.groups = groups;
                that.group = '';
                that.buildGroupOptions(that);
                that.groupsLoading = false;
                deferred.resolve(groups);
            }), angular.bind(this, function (error) {
                that.groupsLoading = false;
                AlertService.addStrataErrorMessage(error);
                deferred.reject();
            }));
            return deferred.promise;
        };
        this.usersLoading = false;
        /**
       *  Intended to be called only after user is logged in and has account details
       *  See securityService.
       */
        this.populateUsers = angular.bind(this, function () {
            var promise = null;
            if (securityService.loginStatus.orgAdmin) {
                this.usersLoading = true;
                var accountNumber = RHAUtils.isEmpty(this.account.number) ? securityService.loginStatus.account.number : this.account.number;
                promise = strataService.accounts.users(accountNumber);
                promise.then(angular.bind(this, function (users) {
                    angular.forEach(users, function(user){
                        if(user.sso_username === securityService.loginStatus.ssoName) {
                            this.owner = user.sso_username;
                        }
                    }, this);
                    this.usersLoading = false;
                    this.users = users;
                }), angular.bind(this, function (error) {
                    this.users = [];
                    this.usersLoading = false;
                    AlertService.addStrataErrorMessage(error);
                }));
            } else {
                var deferred = $q.defer();
                promise = deferred.promise;
                deferred.resolve();
                this.users = [];
            }
            return promise;
        });

        this.scrollToComment = function(commentID) {
            if(!commentID) {
                return;
            }
            var commentElem = document.getElementById(commentID);
            if(commentElem) {
                commentElem.scrollIntoView(true);
            }
        };
        this.populateComments = function (caseNumber) {
            var promise = strataService.cases.comments.get(caseNumber);
            promise.then(angular.bind(this, function (comments) {
                //pull out the draft comment
                angular.forEach(comments, angular.bind(this, function (comment, index) {
                    if (comment.draft === true) {
                        this.draftComment = comment;
                        this.commentText = comment.text;
                        this.isCommentPublic = comment.public;
                        if (RHAUtils.isNotEmpty(this.commentText)) {
                            this.disableAddComment = false;
                        } else if (RHAUtils.isEmpty(this.commentText)) {
                            this.disableAddComment = true;
                        }
                        comments.slice(index, index + 1);
                    }
                }));
                this.comments = comments;
            }), function (error) {
                AlertService.addStrataErrorMessage(error);
            });
            return promise;
        };
        this.entitlementsLoading = false;
        this.populateEntitlements = function (ssoUserName) {
            this.entitlementsLoading = true;
            strataService.entitlements.get(false, ssoUserName).then(angular.bind(this, function (entitlementsResponse) {
                // if the user has any premium or standard level entitlement, then allow them
                // to select it, regardless of the product.
                // TODO: strata should respond with a filtered list given a product.
                //       Adding the query param ?product=$PRODUCT does not work.
                var uniqueEntitlements = function (a) {
                    return a.reduce(function (p, c) {
                        if (p.indexOf(c.sla) < 0) {
                            p.push(c.sla);
                        }
                        return p;
                    }, []);
                };
                var entitlements = uniqueEntitlements(entitlementsResponse.entitlement);
                var unknownIndex = entitlements.indexOf('UNKNOWN');
                if (unknownIndex > -1) {
                    entitlements.splice(unknownIndex, 1);
                }
                this.entitlements = entitlements;
                this.entitlementsLoading = false;
            }), angular.bind(this, function (error) {
                AlertService.addStrataErrorMessage(error);
            }));
        };
        this.showFts = function () {
            if (RHAUtils.isNotEmpty(this.severities)) {
                if (this.entitlement === 'PREMIUM' || this.entitlement === 'AMC' || RHAUtils.isNotEmpty(this.kase.entitlement) && (this.kase.entitlement.sla === 'PREMIUM' || this.kase.entitlement.sla === 'AMC')) {
                    return true;
                }
            }
            return false;
        };
        this.newCasePage1Incomplete = true;
        this.validateNewCasePage1 = function () {
            if (RHAUtils.isEmpty(this.kase.product) || RHAUtils.isEmpty(this.kase.version) || RHAUtils.isEmpty(this.kase.summary) || RHAUtils.isEmpty(this.kase.description) || securityService.loginStatus.isInternal && RHAUtils.isEmpty(this.owner)) {
                this.newCasePage1Incomplete = true;
            } else {
                this.newCasePage1Incomplete = false;
            }
        };
        this.showVersionSunset = function () {
            if (RHAUtils.isNotEmpty(this.kase.product) && RHAUtils.isNotEmpty(this.kase.version)) {
                if ((this.kase.version).toLowerCase().indexOf('- eol') > -1) {
                    return true;
                }
            }
            return false;
        };

        this.buildGroupOptions = function() {
            this.groupOptions = [];
            var sep = '────────────────────────────────────────';
            this.groups.sort(function(a, b){
                if(a.name < b.name) { return -1; }
                if(a.name > b.name) { return 1; }
                return 0;
            });

            var defaultGroup = '';
            if (this.showsearchoptions === true) {
                this.groupOptions.push({
                    value: '',
                    label: 'All Groups'
                }, {
                    value: 'ungrouped',
                    label: 'Ungrouped Cases'
                }, {
                    isDisabled: true,
                    label: sep
                });
            } else {
                this.groupOptions.push({
                    value: '',
                    label: 'Ungrouped Case'
                });
            }

            angular.forEach(this.groups, function(group){
                this.groupOptions.push({
                    value: group.number,
                    label: group.name
                });
                if(group.is_default) {
                    this.kase.group = group.number;
                    this.group = group.number;
                }
            }, this);
            if (this.showsearchoptions === true) {
                this.groupOptions.push({
                    isDisabled: true,
                    label: sep
                }, {
                    value: 'manage',
                    label: 'Manage Case Groups'
                });
            }
        };
    }
]);
