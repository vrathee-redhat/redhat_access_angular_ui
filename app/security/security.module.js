angular.module('RedhatAccess.security', ['ui.bootstrap', 'templates.app', 'ui.router'])
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

      $scope.isLoggedIn = securityService.isLoggedIn;
      $scope.loggedInUser = '';

      $rootScope.$on(AUTH_EVENTS.loginSuccess, function () {
        setLoginStatus(true, securityService.loggedInUser);
      });

      function setLoginStatus(isLoggedIn, user) {
        $scope.isLoggedIn = isLoggedIn;
        securityService.isLoggedIn = isLoggedIn;

        if (user != null) {
          $scope.loggedInUser = user;
          securityService.loggedInUser = user;
        } else {
          $scope.loggedInuser = '';
          securityService.loggedInUser = '';
        }
      };

      strata.checkLogin(loginHandler);

      function loginHandler(result, authedUser) {

        if (result) {
          console.log("Authorized!");
          $scope.$apply(function () {
            setLoginStatus(true, authedUser.name);
            //$scope.loggedInUser = securityService.getLoggedInUserName();
          });
        } else {
          $scope.$apply(function () {
            setLoginStatus(false, '')
          });
        }
      };

      $scope.login = function () {
        securityService.login().then(function (authedUser) {
          if (authedUser) {
            setLoginStatus(true, authedUser.name);
          }
        });

      };
      $scope.logout = function () {
        strata.clearCredentials();
        setLoginStatus(false, '');
        $rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
        location.reload(); //TODO: probably a neater way to do this with $state
      };
    }
  ])
  .service('securityService', ['$rootScope', '$modal', 'AUTH_EVENTS', '$q',
    function ($rootScope, $modal, AUTH_EVENTS, $q) {
      //bool isAuthed = false;
      this.isLoggedIn = false;
      this.loggedInUser = '';

      var modalDefaults = {
        backdrop: true,
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
              if (authedUser) {
                that.isLoggedIn = true;
                that.loggedInUser = authedUser.name;
                defer.resolve(localStorage.getItem("rhAuthToken"));
              }
            },
            function (error) {
              console.log("Unable to get user credentials");
              defer.resolve("");
            });
          return defer.promise;
        }
      };

      this.login = function () {
        return this.showLogin(modalDefaults, modalOptions);
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
                //console.log($scope.user);
                strata.setCredentials($scope.user.user, $scope.user.password,
                  function (passed, authedUser) {
                    if (passed) {
                      $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
                      $scope.user.password = '';
                      $scope.authError = null;
                      try {
                        $modalInstance.close(authedUser);
                      } catch (err) {
                        console.log("Error closing login window.");
                      }
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