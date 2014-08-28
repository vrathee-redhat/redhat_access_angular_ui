'use strict';
/*jshint unused:vars */
/*jshint camelcase: false */
angular.module('RedhatAccess.security').factory('securityService', [
    '$rootScope',
    '$modal',
    'AUTH_EVENTS',
    '$q',
    'LOGIN_VIEW_CONFIG',
    'SECURITY_CONFIG',
    'strataService',
    'AlertService',
    'RHAUtils',
    function($rootScope, $modal, AUTH_EVENTS, $q, LOGIN_VIEW_CONFIG, SECURITY_CONFIG, strataService, AlertService, RHAUtils) {
        var service = {
            loginStatus: {
                isLoggedIn: false,
                loggedInUser: '',
                verifying: false,
                isInternal: false,
                orgAdmin: false,
                hasChat: false,
                sessionId: '',
                canAddAttachments: false,
                ssoName: ''
            },
            loginURL: SECURITY_CONFIG.loginURL,
            logoutURL: SECURITY_CONFIG.logoutURL,
            setLoginStatus: function(isLoggedIn, userName, verifying, isInternal, orgAdmin, hasChat, sessionId, canAddAttachments, ssoName) {
                service.loginStatus.isLoggedIn = isLoggedIn;
                service.loginStatus.loggedInUser = userName;
                service.loginStatus.verifying = verifying;
                service.loginStatus.isInternal = isInternal;
                if (orgAdmin !== null) {
                    service.loginStatus.orgAdmin = orgAdmin;
                }
                if (hasChat !== null) {
                    service.loginStatus.hasChat = hasChat;
                }
                if (sessionId !== null) {
                    service.loginStatus.sessionId = sessionId;
                }
                if (canAddAttachments !== null) {
                    service.loginStatus.canAddAttachments = canAddAttachments;
                }
                if (ssoName !== null) {
                    service.loginStatus.ssoName = ssoName;
                }
            },
            clearLoginStatus: function() {
                service.loginStatus.isLoggedIn = false;
                service.loginStatus.loggedInUser = '';
                service.loginStatus.verifying = false;
                service.loginStatus.isInternal = false;
                service.loginStatus.orgAdmin = false;
                service.loginStatus.hasChat = false;
                service.loginStatus.sessionId = '';
                service.loginStatus.canAddAttachments = false;
                service.loginStatus.account = {};
                service.loginStatus.ssoName = '';
            },
            setAccount: function(accountJSON) {
                service.loginStatus.account = accountJSON;
            },
            modalDefaults: {
                backdrop: 'static',
                keyboard: true,
                modalFade: true,
                templateUrl: 'security/views/login_form.html',
                windowClass: 'rha-login-modal'
            },
            modalOptions: {
                closeButtonText: 'Close',
                actionButtonText: 'OK',
                headerText: 'Proceed?',
                bodyText: 'Perform this action?',
                backdrop: 'static'
            },
            userAllowedToManageEmailNotifications: function(user) {
                if (RHAUtils.isNotEmpty(service.loginStatus.account) && RHAUtils.isNotEmpty(service.loginStatus.account) && service.loginStatus.orgAdmin) {
                    return true;
                } else {
                    return false;
                }
            },
            userAllowedToManageGroups: function(user) {
                if (RHAUtils.isNotEmpty(service.loginStatus.account) && RHAUtils.isNotEmpty(service.loginStatus.account) && (!service.loginStatus.account.has_group_acls || service.loginStatus.account.has_group_acls && service.loginStatus.orgAdmin)) {
                    return true;
                } else {
                    return false;
                }
            },
            getBasicAuthToken: function() {
                var defer = $q.defer();
                var token = localStorage.getItem('rhAuthToken');
                if (token !== undefined && token !== '') {
                    defer.resolve(token);
                    return defer.promise;
                } else {
                    service.login().then(function(authedUser) {
                        defer.resolve(localStorage.getItem('rhAuthToken'));
                    }, function(error) {
                        defer.resolve(error);
                    });
                    return defer.promise;
                }
            },
            loggingIn: false,
            initLoginStatus: function() {
                service.loggingIn = true;
                var defer = $q.defer();
                var wasLoggedIn = service.loginStatus.isLoggedIn;
                var currentSid = service.loginStatus.sessionId;
                service.loginStatus.verifying = true;
                strataService.authentication.checkLogin().then(angular.bind(this, function(authedUser) {
                    var sidChanged = currentSid !== authedUser.session_id;
                    service.setAccount(authedUser.account);
                    service.setLoginStatus(true, authedUser.name, false, authedUser.is_internal, authedUser.org_admin, authedUser.has_chat, authedUser.session_id, authedUser.can_add_attachments, authedUser.login);
                    service.loggingIn = false;
                    //We don't want to resend the AUTH_EVENTS.loginSuccess if we are already logged in
                    if (wasLoggedIn === false) {
                        $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
                    }
                    if (sidChanged) {
                        $rootScope.$broadcast(AUTH_EVENTS.sessionIdChanged);
                    }
                    defer.resolve(authedUser.name);
                }), angular.bind(this, function(error) {
                    service.clearLoginStatus();
                    AlertService.addDangerMessage(error);
                    service.loggingIn = false;
                    defer.reject(error);
                }));
                return defer.promise;
            },
            validateLogin: function(forceLogin) {
                var defer = $q.defer();
                //var that = this;
                if (!forceLogin) {
                    service.initLoginStatus().then(function(username) {
                        defer.resolve(username);
                    }, function(error) {
                        defer.reject(error);
                    });
                    return defer.promise;
                } else {
                    service.initLoginStatus().then(function(username) {
                        defer.resolve(username);
                    }, function(error) {
                        service.login().then(function(authedUser) {
                            defer.resolve(authedUser.name);
                        }, function(error) {
                            defer.reject(error);
                        });
                    });
                    return defer.promise;
                }
            },
            login: function() {
                return service.showLogin(service.modalDefaults, service.modalOptions);
            },
            logout: function() {
                strataService.authentication.logout();
                service.clearLoginStatus();
                $rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
            },
            showLogin: function(customModalDefaults, customModalOptions) {
                //var that = this;
                //Create temp objects to work with since we're in a singleton service
                var tempModalDefaults = {};
                var tempModalOptions = {};
                //Map angular-ui modal custom defaults to modal defaults defined in service
                angular.extend(tempModalDefaults, service.modalDefaults, customModalDefaults);
                //Map modal.html $scope custom properties to defaults defined in service
                angular.extend(tempModalOptions, service.modalOptions, customModalOptions);
                if (!tempModalDefaults.controller) {
                    tempModalDefaults.controller = [
                        '$scope',
                        '$modalInstance',
                        function($scope, $modalInstance) {
                            $scope.user = {
                                user: null,
                                password: null
                            };
                            $scope.useVerboseLoginView = LOGIN_VIEW_CONFIG.verbose;
                            $scope.modalOptions = tempModalOptions;
                            $scope.modalOptions.ok = function(result) {
                                //Hack below is needed to handle autofill issues
                                //@see https://github.com/angular/angular.js/issues/1460
                                //BEGIN HACK
                                $scope.user.user = $('#rha-login-user-id').val();
                                $scope.user.password = $('#rha-login-password').val();
                                //END HACK
                                var resp = strataService.authentication.setCredentials($scope.user.user, $scope.user.password);
                                if (resp) {
                                    service.initLoginStatus().then(
                                        function(authedUser) {
                                            $scope.user.password = '';
                                            $scope.authError = null;
                                            try {
                                                $modalInstance.close(authedUser);
                                            } catch (err) {}
                                        },
                                        function(error) {
                                            if ($scope.$root.$$phase !== '$apply' && $scope.$root.$$phase !== '$digest') {
                                                $scope.$apply(function() {
                                                    $scope.authError = 'Login Failed!';
                                                });
                                            } else {
                                                $scope.authError = 'Login Failed!';
                                            }
                                        }
                                    );
                                }else {
                                    $scope.authError = 'Login Failed!';
                                }
                            };
                            $scope.modalOptions.close = function() {
                                $modalInstance.dismiss('User Canceled Login');
                            };
                        }
                    ];
                }
                return $modal.open(tempModalDefaults).result;
            },
        };
        return service;
    }
]);