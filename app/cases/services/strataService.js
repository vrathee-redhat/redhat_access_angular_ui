'use strict';

angular.module('RedhatAccessCases')
.factory('strataService', ['$q', function ($q) {
  return {
    products: {
      list: function() {
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
      }
    },
    groups: {
      list: function() {
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
    },
    accounts: {
      get: function(accountNumber) {
        var deferred = $q.defer();

        strata.accounts.get(
          accountNumber,
          function(response) {
            deferred.resolve(response);
          },
          function(error) {
            deferred.reject(error);
          }
        );

        return deferred.promise;
      }
    },
    cases: {
      attachments: {
        list: function(id) {
          var deferred = $q.defer();

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
        }
      },
      comments: {
        get: function(id) {
          var deferred = $q.defer();

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
        }
      },
      get: function(id) {
        var deferred = $q.defer();

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
      filter: function() {
        var deferred = $q.defer();

        strata.cases.filter(
            {},
            function(allCases) {
              deferred.resolve(allCases);
            },
            function(error) {
              deferred.reject(error);
            }
        );

        return deferred.promise;
      }
    },
    values: {
      cases: {
        severity: function() {
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
        status: function() {
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
        },
        types: function() {
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
        }
      }
    }
  };
}]);
