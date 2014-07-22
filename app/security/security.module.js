'use strict';
/*global strata,$*/
/*jshint unused:vars */
/*jshint camelcase: false */
angular.module('RedhatAccess.security', ['ui.bootstrap', 'RedhatAccess.template', 'ui.router', 'RedhatAccess.common', 'RedhatAccess.header'])
  .constant('AUTH_EVENTS', {
    loginSuccess: 'auth-login-success',
    loginFailed: 'auth-login-failed',
    logoutSuccess: 'auth-logout-success',
    sessionTimeout: 'auth-session-timeout',
    notAuthenticated: 'auth-not-authenticated',
    notAuthorized: 'auth-not-authorized'
  })
  .directive('rhaLoginstatus', function () {
    return {
      restrict: 'AE',
      scope: false,
      templateUrl: 'security/login_status.html'
    };
  })
  .controller('SecurityController', ['$scope', '$rootScope', 'securityService', 'SECURITY_CONFIG',
    function ($scope, $rootScope, securityService, SECURITY_CONFIG) {
      $scope.securityService = securityService;
      if (SECURITY_CONFIG.autoCheckLogin) {
        securityService.validateLogin(SECURITY_CONFIG.forceLogin);
      }
      $scope.displayLoginStatus = function () {
        return SECURITY_CONFIG.displayLoginStatus;

      };
    }
  ])
  .value('LOGIN_VIEW_CONFIG', {
    verbose: true,
  })
  .value('SECURITY_CONFIG', {
    displayLoginStatus: true,
    autoCheckLogin: true,
    loginURL: '',
    logoutURL: '',
    forceLogin: false,

  })
  .service('securityService', [
    '$rootScope',
    '$modal',
    'AUTH_EVENTS',
    '$q',
    'LOGIN_VIEW_CONFIG',
    'SECURITY_CONFIG',
    'strataService',
    'AlertService',
    'RHAUtils',
    function (
      $rootScope,
      $modal,
      AUTH_EVENTS,
      $q,
      LOGIN_VIEW_CONFIG,
      SECURITY_CONFIG,
      strataService,
      AlertService,
      RHAUtils) {

      this.loginStatus = {
        isLoggedIn: false,
        loggedInUser: '',
        verifying: false,
        isInternal: false,
        orgAdmin: false,
        hasChat: false,
        sessionId: '',
        canAddAttachments: false,
        login: ''
      };

      this.loginURL = SECURITY_CONFIG.loginURL;
      this.logoutURL = SECURITY_CONFIG.logoutURL;

      this.setLoginStatus = function (
        isLoggedIn,
        userName,
        verifying,
        isInternal,
        orgAdmin,
        hasChat,
        sessionId,
        canAddAttachments,
        login) {
        this.loginStatus.isLoggedIn = isLoggedIn;
        this.loginStatus.loggedInUser = userName;
        this.loginStatus.verifying = verifying;
        this.loginStatus.isInternal = isInternal;
        this.loginStatus.orgAdmin = orgAdmin;
        this.loginStatus.hasChat = hasChat;
        this.loginStatus.sessionId = sessionId;
        this.loginStatus.canAddAttachments = canAddAttachments;
        this.loginStatus.login = login;
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
      };

      this.setAccount = function (accountJSON) {
        this.loginStatus.account = accountJSON;
      };

      var modalDefaults = {
        backdrop: 'static',
        keyboard: true,
        modalFade: true,
        templateUrl: 'security/login_form.html',
        windowClass: 'rha-login-modal'
      };

      var modalOptions = {
        closeButtonText: 'Close',
        actionButtonText: 'OK',
        headerText: 'Proceed?',
        bodyText: 'Perform this action?',
        backdrop: 'static'

      };



      this.userAllowedToManage = function (user) {
        if ((RHAUtils.isNotEmpty(this.loginStatus.account) && RHAUtils.isNotEmpty(this.loginStatus.account)) &&
          ((this.loginStatus.account.has_group_acls && this.loginStatus.orgAdmin))) {
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
          this.login().then(
            function (authedUser) {
              defer.resolve(localStorage.getItem('rhAuthToken'));
            },
            function (error) {
              console.log('Unable to get user credentials');
              defer.resolve(error);
            });
          return defer.promise;
        }
      };

      this.loggingIn = false;

      this.initLoginStatus = function () {
        this.loggingIn = true;

        var defer = $q.defer();
        var that = this;
        var wasLoggedIn = this.loginStatus.isLoggedIn;
        this.loginStatus.verifying = true;
        strata.checkLogin(
          angular.bind(this, function (result, authedUser) {
            if (result) {

              strataService.accounts.list().then(
                angular.bind(this, function (accountNumber) {
                  strataService.accounts.get(accountNumber).then(
                    angular.bind(this, function (account) {
                      that.setAccount(account);
                      that.setLoginStatus(
                        true,
                        authedUser.name,
                        false,
                        authedUser.is_internal,
                        authedUser.org_admin,
                        authedUser.has_chat,
                        authedUser.session_id,
                        authedUser.can_add_attachments,
                        authedUser.login);
                      this.loggingIn = false;
                      //We don't want to resend the AUTH_EVENTS.loginSuccess if we are already logged in
                      if (wasLoggedIn === false) {
                        $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
                      }
                      defer.resolve(authedUser.name);
                    })
                  );
                }),
                angular.bind(this, function (error) {
                  AlertService.addStrataErrorMessage(error);
                  this.loggingIn = false;
                  defer.resolve(authedUser.name);
                })
              );
            } else {
              this.loggingIn = false;
              that.clearLoginStatus();
              defer.reject('');
            }
          })
        );
        return defer.promise;
      };

      this.validateLogin = function (forceLogin) {
        var defer = $q.defer();
        var that = this;
        if (!forceLogin) {
          this.initLoginStatus().then(
            function (username) {
              defer.resolve(username);
            },
            function (error) {
              defer.reject(error);
            }
          );
          return defer.promise;
        } else {
          this.initLoginStatus().then(
            function (username) {
              console.log('User name is ' + username);
              defer.resolve(username);
            },
            function (error) {
              that.login().then(
                function (authedUser) {
                  defer.resolve(authedUser.name);
                },
                function (error) {
                  defer.reject(error);
                });
            }
          );
          return defer.promise;
        }
      };

      this.login = function () {
        var that = this;
        var result = this.showLogin(modalDefaults, modalOptions);
        result.then(
          function (authedUser) {
            console.log('User logged in : ' + authedUser.name);
            that.setLoginStatus(true, authedUser.name, false, authedUser.is_internal);
          },
          function (error) {
            console.log('Unable to login user');
            that.clearLoginStatus();
          });
        return result; // pass on the promise
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
          tempModalDefaults.controller = ['$scope', '$modalInstance',
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
                strata.setCredentials($scope.user.user, $scope.user.password,
                  function (passed, authedUser) {
                    if (passed) {
                      $scope.user.password = '';
                      $scope.authError = null;
                      try {
                        $modalInstance.close(authedUser);
                      } catch (err) {}
                      that.setLoginStatus(
                        true,
                        authedUser.name,
                        false,
                        authedUser.is_internal,
                        authedUser.org_admin,
                        authedUser.has_chat,
                        authedUser.session_id,
                        authedUser.can_add_attachments,
                        authedUser.login);
                      $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
                    } else {
                      // alert("Login failed!");
                      $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
                      if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
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