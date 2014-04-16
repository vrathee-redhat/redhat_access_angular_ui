'use strict';

angular.module('RedhatAccess.cases')
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
      },
      versions: function(productCode) {
        var deferred = $q.defer();

        strata.products.versions(
            productCode,
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
        },
        post: function(attachment, caseNumber) {
          var deferred = $q.defer();

          strata.cases.attachments.post(
              attachment,
              caseNumber,
              function(response, code, xhr) {
                deferred.resolve(xhr.getResponseHeader('Location'));
              },
              function(error) {
                console.log(error);
                deferred.reject(error);
              }
          );

          return deferred.promise;
        },
        delete: function(id, caseNumber) {

          var deferred = $q.defer();

          strata.cases.attachments.delete(
              id,
              caseNumber,
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
      filter: function(params) {
        var deferred = $q.defer();
        if (params == null) {
          params = {};
        }
        if (params.count == null) {
          params.count = 50;
        }

        strata.cases.filter(
            params,
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
