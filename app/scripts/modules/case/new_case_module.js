angular.module('RedhatAccessNewCase', [
  'ui.router',
  'ui.bootstrap'
])
.config([
  '$stateProvider',
  function($stateProvider) {
    $stateProvider.state('new', {
      url: '/case/new',
      templateUrl: 'views/case/new_case.html',
      controller: 'NewController',
      resolve: {
        productsJSON: function($q) {
          var deferred = $q.defer();

          strata.products.list(
              function(response) {
                deferred.resolve(response);
              },
              function(error) {
                deferred.reject(error);
              }
          );

          return deferred.promise;
        },
        severityJSON: function($q) {
          var deferred = $q.defer();

          strata.values.cases.severity  (
              function(response) {
                deferred.resolve(response);
              },
              function(error) {
                deferred.reject(error);
              }
          );

          return deferred.promise;
        },
        groupsJSON: function($q) {
          var deferred = $q.defer();

          strata.groups.list (
              function(response) {
                deferred.resolve(response);
              },
              function(error) {
                deferred.reject(error);
              }
          );

          return deferred.promise;
        }
      }
    });
  }]);
