'use strict';
/*global strata*/
 /*jshint camelcase: false */
 /*jshint unused:vars */

angular.module('RedhatAccess.cases')
.factory('strataService', ['$q', function ($q) {

  var errorHandler = function(message, xhr, response, status) {
    this.reject({
      message: message,
      xhr: xhr,
      response: response,
      status: status
    });
  };

  return {
    problems: function(data, max) {
      var deferred = $q.defer();

      strata.problems(
          data,
          function(solutions) {
            deferred.resolve(solutions);
          },
          angular.bind(deferred, errorHandler),
          max
      );

      return deferred.promise;
    },
    solutions: {
      get: function(uri) {
        var deferred = $q.defer();

        strata.solutions.get(
            uri,
            function(solution) {
              deferred.resolve(solution);
            },
            function() {
              //workaround for 502 from strata
              //If the deferred is rejected then the parent $q.all()
              //based deferred will fail. Since we don't need every
              //recommendation just send back undefined
              //and the caller can ignore the missing solution details.
              deferred.resolve();
            }
        );

        return deferred.promise;
      }
    },
    products: {
      list: function() {
        var deferred = $q.defer();

        strata.products.list(
            function (response) {
              deferred.resolve(response);
            },
            angular.bind(deferred, errorHandler)
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
            angular.bind(deferred, errorHandler)
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
            angular.bind(deferred, errorHandler)
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
          angular.bind(deferred, errorHandler)
        );

        return deferred.promise;
      },
      users: function(accountNumber, group) {
        var deferred = $q.defer();

        strata.accounts.users(
          accountNumber,
          function(response) {
            deferred.resolve(response);
          },
          angular.bind(deferred, errorHandler),
          group
        );

        return deferred.promise;
      },
      list: function() {
        var deferred = $q.defer();

        strata.accounts.list(
          function(response) {
            deferred.resolve(response);
          },
          angular.bind(deferred, errorHandler)
        );

        return deferred.promise;
      }
    },
    cases: {
      list: function(closed, query) {
        var deferred = $q.defer();

        strata.cases.list(
            function (response) {
              deferred.resolve(response);
            },
            angular.bind(deferred, errorHandler),
            closed,
            query
        );

        return deferred.promise;
      },
      attachments: {
        list: function(id) {
          var deferred = $q.defer();

          strata.cases.attachments.list(
              id,
              function (response) {
                deferred.resolve(response);
              },
              angular.bind(deferred, errorHandler)
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
              angular.bind(deferred, errorHandler)
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
              angular.bind(deferred, errorHandler)
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
              angular.bind(deferred, errorHandler)
          );

          return deferred.promise;
        },
        post: function(case_number, text) {
          var deferred = $q.defer();

          strata.cases.comments.post(
              case_number,
              {'text': text},
              function(response) {
                deferred.resolve(response);
              },
              angular.bind(deferred, errorHandler)
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
            angular.bind(deferred, errorHandler)
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
            angular.bind(deferred, errorHandler)
        );

        return deferred.promise;
      },
      post: function(caseJSON) {
        var deferred = $q.defer();

        strata.cases.post(
            caseJSON,
            function (caseNumber) {
              deferred.resolve(caseNumber);
            },
            angular.bind(deferred, errorHandler)
        );

        return deferred.promise;
      },
      put: function(case_number, caseJSON) {
        var deferred = $q.defer();

        strata.cases.put(
            case_number,
            caseJSON,
            function(response) {
              deferred.resolve(response);
            },
            angular.bind(deferred, errorHandler)
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
              angular.bind(deferred, errorHandler)
          );

          return deferred.promise;
        },
        status: function() {
          var deferred = $q.defer();

          strata.values.cases.status(
              function (response) {
                deferred.resolve(response);
              },
              angular.bind(deferred, errorHandler)
          );

          return deferred.promise;
        },
        types: function() {
          var deferred = $q.defer();

          strata.values.cases.types(
              function (response) {
                deferred.resolve(response);
              },
              angular.bind(deferred, errorHandler)
          );

          return deferred.promise;
        }
      }
    }
  };
}]);
