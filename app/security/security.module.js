angular.module('RedhatAccess.security', ['ui.bootstrap', 'RedhatAccess.template', 'ui.router'])
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
  .controller('SecurityController', ['$scope', '$rootScope', 'securityService', 'AUTH_EVENTS',
    function ($scope, $rootScope, securityService, AUTH_EVENTS) {
      $scope.securityService = securityService;
      securityService.validateLogin(false); //change to false to force login
    }
  ])
  .service('securityService', ['$rootScope', '$modal', 'AUTH_EVENTS', '$q',
    function ($rootScope, $modal, AUTH_EVENTS, $q) {

      this.loginStatus = {
        isLoggedIn: false,
        loggedInUser: '',
        verifying: false
      };

      this.setLoginStatus = function (isLoggedIn, userName, verifying) {
        this.loginStatus.isLoggedIn = isLoggedIn;
        this.loginStatus.loggedInUser = userName;
        this.loginStatus.verifying = verifying;
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

      this.getBasicAuthToken = function () {
        var defer = $q.defer();
        var token = localStorage.getItem("rhAuthToken");
        if (token !== undefined && token !== '') {
          defer.resolve(token);
          return defer.promise;
        } else {
          var that = this;
          this.login().then(
            function (authedUser) {
              defer.resolve(localStorage.getItem("rhAuthToken"));
            },
            function (error) {
              console.log("Unable to get user credentials");
              defer.resolve("");
            });
          return defer.promise;
        }
      };

      this.initLoginStatus = function () {
        var defer = $q.defer();
        var that = this;
        this.loginStatus.verifying = true;
        strata.checkLogin(
          function (result, authedUser) {
            if (result) {
              that.setLoginStatus(true, authedUser.name, false);
              defer.resolve(authedUser.name);
            } else {
              that.setLoginStatus(false, '', false);
              defer.reject('');
            }
          }
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
              defer.reject("");
            }
          );
          return defer.promise;
        } else {
          this.initLoginStatus().then(
            function (username) {
              console.log("User name is " + username);
              defer.resolve(username);
            },
            function (error) {
              that.login().then(
                function (authedUser) {                 
                  defer.resolve(authedUser.name);
                },
                function (error) {
                  defer.reject("");
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
            console.log("User logged in : " + authedUser.name);
            that.setLoginStatus(true, authedUser.name, false);
          },
          function (error) {
             console.log("Unable to login user");
            that.setLoginStatus(false, '', false);
          });
        return result; // pass on the promise
      };

      this.logout = function () {
        strata.clearCredentials();
        this.setLoginStatus(false, '', false);
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
              $scope.modalOptions = tempModalOptions;
              $scope.modalOptions.ok = function (result) {
                //Hack below is needed to handle autofill issues
                //@see https://github.com/angular/angular.js/issues/1460
                //BEGIN HACK
                $scope.user.user = $("#rha-login-user-id").val();
                $scope.user.password = $("#rha-login-password").val();
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
                        $scope.authError = "Login Failed!";
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