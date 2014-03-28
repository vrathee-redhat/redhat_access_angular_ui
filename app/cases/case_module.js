angular.module('RedhatAccessCases', [
  'ui.router',
  'ui.bootstrap',
  'templates.app'
])
  .config([
    '$stateProvider',
    function ($stateProvider) {
      $stateProvider.state('case', {
        url: '/case/{id:[0-9]{1,8}}',
        templateUrl: 'cases/views/details.html',
        controller: 'Details',
        resolve: {
          caseJSON: function ($q, $stateParams) {
            var deferred = $q.defer();
            var id = $stateParams.id;

            strata.cases.get(
              id,
              function (response) {
                deferred.resolve(response);
              },
              function (error) {
                deferred.reject(error);
              }
            );

            return deferred.promise;
          },
          attachmentsJSON: function ($q, $stateParams) {
            var deferred = $q.defer();
            var id = $stateParams.id;

            strata.cases.attachments.list(
              id,
              function (response) {
                deferred.resolve(response);
              },
              function (error) {
                deferred.reject(error);
              }
            );

            return deferred.promise;
          },
          commentsJSON: function ($q, $stateParams) {
            var deferred = $q.defer();
            var id = $stateParams.id;

            strata.cases.comments.get(
              id,
              function (response) {
                deferred.resolve(response);
              },
              function (error) {
                deferred.reject(error);
              }
            );

            return deferred.promise;
          },
          caseTypesJSON: function ($q) {
            var deferred = $q.defer();

            strata.values.cases.types(
              function (response) {
                deferred.resolve(response);
              },
              function (error) {
                deferred.reject(error);
              }
            );

            return deferred.promise;
          },
          severitiesJSON: function ($q) {
            var deferred = $q.defer();

            strata.values.cases.severity(
              function (response) {
                deferred.resolve(response);
              },
              function (error) {
                deferred.reject(error);
              }
            );

            return deferred.promise;
          },
          groupsJSON: function ($q) {
            var deferred = $q.defer();

            strata.groups.list(
              function (response) {
                deferred.resolve(response);
              },
              function (error) {
                deferred.reject(error);
              }
            );

            return deferred.promise;
          },
          productsJSON: function ($q) {
            var deferred = $q.defer();

            strata.products.list(
              function (response) {
                deferred.resolve(response);
              },
              function (error) {
                deferred.reject(error);
              }
            );

            return deferred.promise;
          },
          statusesJSON: function ($q) {
            var deferred = $q.defer();

            strata.values.cases.status(
              function (response) {
                deferred.resolve(response);
              },
              function (error) {
                deferred.reject(error);
              }
            );

            return deferred.promise;
          }
        }
      });

      $stateProvider.state('new', {
        url: '/case/new',
        templateUrl: 'cases/views/new.html',
        controller: 'New',
        resolve: {
          productsJSON: function ($q) {
            var deferred = $q.defer();

            strata.products.list(
              function (response) {
                deferred.resolve(response);
              },
              function (error) {
                deferred.reject(error);
              }
            );

            return deferred.promise;
          },
          severityJSON: function ($q) {
            var deferred = $q.defer();

            strata.values.cases.severity(
              function (response) {
                deferred.resolve(response);
              },
              function (error) {
                deferred.reject(error);
              }
            );

            return deferred.promise;
          },
          groupsJSON: function ($q) {
            var deferred = $q.defer();

            strata.groups.list(
              function (response) {
                deferred.resolve(response);
              },
              function (error) {
                deferred.reject(error);
              }
            );

            return deferred.promise;
          }
        }
      });
    }
  ])
  .run([
    '$rootScope',
    'securityService',
    '$state',
    function (
      $rootScope,
      securityService,
      $state) {

      $rootScope.$on('$stateChangeStart',
        function (event, toState, toParams, fromState, fromParams) {
          if (!securityService.isLoggedIn) {
            event.preventDefault();

            strata.checkLogin(
              function (isLoggedIn, user) {

                if (!isLoggedIn) {
                  securityService.login().then(
                    function (authedUser) {
                      if (authedUser) {
                        securityService.isLoggedIn = true;
                        $state.transitionTo(toState, toParams);
                      } else {
                        securityService.isLoggedIn = false;
                        console.log('Not logged in.');
                      }
                    });
                } else {
                  securityService.isLoggedIn = true;
                  $state.transitionTo(toState, toParams);
                }

              }
            );
          }
        }
      );

    }
  ]);