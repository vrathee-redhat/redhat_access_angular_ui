'use strict';
/*global strata,$*/
/*jshint unused:vars */
/*jshint camelcase: false */
angular.module('RedhatAccess.security').service('securityService', [
    '$rootScope',
    '$modal',
    'AUTH_EVENTS',
    '$q',
    'LOGIN_VIEW_CONFIG',
    'SECURITY_CONFIG',
    'strataService',
    'AlertService',
    'RHAUtils',
    function ($rootScope, $modal, AUTH_EVENTS, $q, LOGIN_VIEW_CONFIG, SECURITY_CONFIG, strataService, AlertService, RHAUtils) {
        this.loginStatus = {
            isLoggedIn: false,
            loggedInUser: '',
            verifying: false,
            isInternal: false,
            orgAdmin: false,
            hasChat: false,
            sessionId: '',
            canAddAttachments: false,
            ssoName: ''
        };
        this.loginURL = SECURITY_CONFIG.loginURL;
        this.logoutURL = SECURITY_CONFIG.logoutURL;
        this.setLoginStatus = function (isLoggedIn, userName, verifying, isInternal, orgAdmin, hasChat, sessionId, canAddAttachments, ssoName) {
            this.loginStatus.isLoggedIn = isLoggedIn;
            this.loginStatus.loggedInUser = userName;
            this.loginStatus.verifying = verifying;
            this.loginStatus.isInternal = isInternal;
            if (orgAdmin !== null) {
                this.loginStatus.orgAdmin = orgAdmin;
            }
            if (hasChat !== null) {
                this.loginStatus.hasChat = hasChat;
            }
            if (sessionId !== null) {
                this.loginStatus.sessionId = sessionId;
            }
            if (canAddAttachments !== null) {
                this.loginStatus.canAddAttachments = canAddAttachments;
            }
            if (ssoName !== null) {
                this.loginStatus.ssoName = ssoName;
            }
        };
        this.clearLoginStatus = function () {
            this.loginStatus.isLoggedIn = false;
            this.loginStatus.loggedInUser = '';
            this.loginStatus.verifying = false;
            this.loginStatus.isInternal = false;
            this.loginStatus.orgAdmin = false;
            this.loginStatus.hasChat = false;
            this.loginStatus.sessionId = '';
            this.loginStatus.canAddAttachments = false;
            this.loginStatus.account = {};
            this.loginStatus.ssoName = '';
        };
        this.setAccount = function (accountJSON) {
            this.loginStatus.account = accountJSON;
        };
        var modalDefaults = {
                backdrop: 'static',
                keyboard: true,
                modalFade: true,
                templateUrl: 'security/views/login_form.html',
                windowClass: 'rha-login-modal'
            };
        var modalOptions = {
                closeButtonText: 'Close',
                actionButtonText: 'OK',
                headerText: 'Proceed?',
                bodyText: 'Perform this action?',
                backdrop: 'static'
            };
        this.userAllowedToManageEmailNotifications = function (user) {
            if (RHAUtils.isNotEmpty(this.loginStatus.account) && RHAUtils.isNotEmpty(this.loginStatus.account) && this.loginStatus.orgAdmin) {
                return true;
            } else {
                return false;
            }
        };
        this.userAllowedToManageGroups = function (user) {
            if (RHAUtils.isNotEmpty(this.loginStatus.account) && RHAUtils.isNotEmpty(this.loginStatus.account) && (!this.loginStatus.account.has_group_acls || this.loginStatus.account.has_group_acls && this.loginStatus.orgAdmin)) {
                return true;
            } else {
                return false;
            }
        };
        this.getBasicAuthToken = function () {
            var defer = $q.defer();
            var token = localStorage.getItem('rhAuthToken');
            if (token !== undefined && token !== '') {
                defer.resolve(token);
                return defer.promise;
            } else {
                this.login().then(function (authedUser) {
                    defer.resolve(localStorage.getItem('rhAuthToken'));
                }, function (error) {
                    defer.resolve(error);
                });
                return defer.promise;
            }
        };
        this.loggingIn = false;
        this.initLoginStatus = function () {
            this.loggingIn = true;
            var defer = $q.defer();
            var wasLoggedIn = this.loginStatus.isLoggedIn;
            var currentSid = this.loginStatus.sessionId;
            this.loginStatus.verifying = true;
            strataService.authentication.checkLogin().then(angular.bind(this, function (authedUser) {
                var sidChanged = currentSid !== authedUser.session_id;
                this.setAccount(authedUser.account);
                this.setLoginStatus(true, authedUser.name, false, authedUser.is_internal, authedUser.org_admin, authedUser.has_chat, authedUser.session_id, authedUser.can_add_attachments, authedUser.login);
                this.loggingIn = false;
                //We don't want to resend the AUTH_EVENTS.loginSuccess if we are already logged in
                if (wasLoggedIn === false) {
                    $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
                }
                if (sidChanged) {
                    $rootScope.$broadcast(AUTH_EVENTS.sessionIdChanged);
                }
                defer.resolve(authedUser.name);
            }), angular.bind(this, function (error) {
                AlertService.addDangerMessage(error);
                this.loggingIn = false;
                defer.reject(error);
            }));
            return defer.promise;
        };
        this.validateLogin = function (forceLogin) {
            var defer = $q.defer();
            var that = this;
            if (!forceLogin) {
                this.initLoginStatus().then(function (username) {
                    defer.resolve(username);
                }, function (error) {
                    defer.reject(error);
                });
                return defer.promise;
            } else {
                this.initLoginStatus().then(function (username) {
                    defer.resolve(username);
                }, function (error) {
                    that.login().then(function (authedUser) {
                        defer.resolve(authedUser.name);
                    }, function (error) {
                        defer.reject(error);
                    });
                });
                return defer.promise;
            }
        };
        this.login = function () {
            var that = this;
            var result = this.showLogin(modalDefaults, modalOptions);
            result.then(function (authedUser) {
                //that.setLoginStatus(true, authedUser.name, false, authedUser.is_internal);
                that.initLoginStatus();
            }, function (error) {
                that.clearLoginStatus();
            });
            return result;    // pass on the promise
        };
        this.logout = function () {
            strata.clearCredentials();
            this.clearLoginStatus();
            $rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
        };
        this.getLoggedInUserName = function () {
            return strata.getAuthInfo().name;
        };
        this.showLogin = function (customModalDefaults, customModalOptions) {
            var that = this;
            //Create temp objects to work with since we're in a singleton service
            var tempModalDefaults = {};
            var tempModalOptions = {};
            //Map angular-ui modal custom defaults to modal defaults defined in service
            angular.extend(tempModalDefaults, modalDefaults, customModalDefaults);
            //Map modal.html $scope custom properties to defaults defined in service
            angular.extend(tempModalOptions, modalOptions, customModalOptions);
            if (!tempModalDefaults.controller) {
                tempModalDefaults.controller = [
                    '$scope',
                    '$modalInstance',
                    function ($scope, $modalInstance) {
                        $scope.user = {
                            user: null,
                            password: null
                        };
                        $scope.useVerboseLoginView = LOGIN_VIEW_CONFIG.verbose;
                        $scope.modalOptions = tempModalOptions;
                        $scope.modalOptions.ok = function (result) {
                            //Hack below is needed to handle autofill issues
                            //@see https://github.com/angular/angular.js/issues/1460
                            //BEGIN HACK
                            $scope.user.user = $('#rha-login-user-id').val();
                            $scope.user.password = $('#rha-login-password').val();
                            //END HACK
                            strata.setCredentials($scope.user.user, $scope.user.password, function (passed, authedUser) {
                                if (passed) {
                                    $scope.user.password = '';
                                    $scope.authError = null;
                                    try {
                                        $modalInstance.close(authedUser);
                                    } catch (err) {
                                    }
                                    that.setLoginStatus(true, authedUser.name, false, authedUser.is_internal, authedUser.org_admin, authedUser.has_chat, authedUser.session_id, authedUser.can_add_attachments, authedUser.login);
                                    $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
                                } else {
                                    // alert("Login failed!");
                                    $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
                                    if ($scope.$root.$$phase !== '$apply' && $scope.$root.$$phase !== '$digest') {
                                        $scope.$apply(function () {
                                            $scope.authError = 'Login Failed!';
                                        });
                                    } else {
                                        $scope.authError = 'Login Failed!';
                                    }
                                }
                            });
                        };
                        $scope.modalOptions.close = function () {
                            $modalInstance.dismiss();
                        };
                    }
                ];
            }
            return $modal.open(tempModalDefaults).result;
        };
    }
]);