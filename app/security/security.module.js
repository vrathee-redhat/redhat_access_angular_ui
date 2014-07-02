'use strict';
/*global strata,$*/
/*jshint unused:vars */
angular.module('RedhatAccess.security', ['ui.bootstrap', 'RedhatAccess.template', 'ui.router', 'RedhatAccess.common',])
  .constant('AUTH_EVENTS', {
    loginSuccess: 'auth-login-success',
    loginFailed: 'auth-login-failed',
    logoutSuccess: 'auth-logout-success',
    sessionTimeout: 'auth-session-timeout',
    notAuthenticated: 'auth-not-authenticated',
    notAuthorized: 'auth-not-authorized'
  })
  .directive('rhaLoginStatus', function () {
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
        securityService.validateLogin(false); //change to false to force login
      }
      $scope.displayLoginStatus = function(){
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
    loginURL: "",
    logoutURL: ""
  })
  .service('securityService', [
      '$rootScope',
      '$modal',
      'AUTH_EVENTS',
      '$q',
      'LOGIN_VIEW_CONFIG',
      'SECURITY_CONFIG',
      'strataService',
      'RHAUtils',
    function (
      $rootScope,
      $modal,
      AUTH_EVENTS,
      $q,
      LOGIN_VIEW_CONFIG,
      SECURITY_CONFIG,
      strataService,
      RHAUtils) {

      this.loginStatus = {
        isLoggedIn: false,
        loggedInUser: '',
        verifying: false,
        isInternal: false,
        orgAdmin: false,
        hasChat: false,
        sessionId: '',
        canAddAttachments: false
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
        canAddAttachments) {
        this.loginStatus.isLoggedIn = isLoggedIn;
        this.loginStatus.loggedInUser = userName;
        this.loginStatus.verifying = verifying;
        this.loginStatus.isInternal = isInternal;
        this.loginStatus.orgAdmin = orgAdmin;
        this.loginStatus.hasChat = hasChat;
        this.loginStatus.sessionId = sessionId;
        this.loginStatus.canAddAttachments = canAddAttachments;
      };

      this.clearLoginStatus = function() {
        this.isLoggedIn = false;
        this.loggedInUser = '';
        this.verifying = false;
        this.isInternal = false;
        this.orgAdmin = false;
        this.hasChat = false;
        this.sessionId = '';
        this.canAddAttachments = false;
      };

      this.setAccount = function(accountJSON) {
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

      this.postLoginEvents = [];

      this.userAllowedToManage = function(user) {
        if ((RHAUtils.isNotEmpty(this.loginStatus.account) && RHAUtils.isNotEmpty(this.loginStatus.account))
              && ((this.loginStatus.account.has_group_acls && this.loginStatus.orgAdmin) || !this.loginStatus.has_group_acls)) {
            return true;
        } else {
          return false;
        }
      }

      this.registerAfterLoginEvent = function(func, scope) {
        if (this.loginStatus.isLoggedIn) {
          if (RHAUtils.isNotEmpty(scope)) {
            angular.bind(scope, func());
          } else {
            func();
          }
        } else {
          if (RHAUtils.isNotEmpty(scope)) {
            this.postLoginEvents.push(angular.bind(scope, func));
          } else {
            this.postLoginEvents.push(func);
          }
        }
      }

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
        this.loginStatus.verifying = true;
        strata.checkLogin(
          angular.bind(this, function (result, authedUser) {
            if (result) {
              that.setLoginStatus(
                true,
                authedUser.name,
                false,
                authedUser.is_internal,
                authedUser.org_admin,
                authedUser.has_chat,
                authedUser.session_id,
                authedUser.can_add_attachments);

              strataService.accounts.list().then(
                angular.bind(this, function(accountNumber) {
                  strataService.accounts.get(accountNumber).then(
                    angular.bind(this, function(account) {
                      that.setAccount(account)

                      angular.forEach(
                        that.postLoginEvents,
                        function(callback) {
                          callback();
                        });

                      this.loggingIn = false;
                      defer.resolve(authedUser.name);
                    })
                  );
                }),
                angular.bind(this, function(error) {
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
                      $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
                      $scope.user.password = '';
                      $scope.authError = null;
                      try {
                        $modalInstance.close(authedUser);
                      } catch (err) {}
                    } else {
                      // alert("Login failed!");
                      $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
                      $scope.$apply(function () {
                        $scope.authError = 'Login Failed!';
                      });
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
