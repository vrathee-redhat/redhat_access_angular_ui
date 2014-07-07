'use strict';
/*global strata*/
/*jshint camelcase: false */
/*jshint unused:vars */

angular.module('RedhatAccess.common')
  .factory('strataService', ['$q', 'translate', 'RHAUtils',
    function ($q, translate, RHAUtils) {

      var errorHandler = function (message, xhr, response, status) {

        var translatedMsg = message;
        console.log('Strata status is ' + status);

        switch (status) {
        case 'Unauthorized':
          translatedMsg = translate('Unauthorized.');
          break;
        // case n:
        //   code block
        //   break;
        }
        this.reject({
          message: translatedMsg,
          xhr: xhr,
          response: response,
          status: status
        });
      };

      return {
        entitlements: {
          //entitlements.get
          get: function(showAll, ssoUserName) {
            var deferred = $q.defer();

            strata.entitlements.get(
              showAll,
              function (entitlements) {
                deferred.resolve(entitlements);
              },
              angular.bind(deferred, errorHandler),
              ssoUserName
            );

            return deferred.promise; 
          }
        },
        problems: function (data, max) {
          var deferred = $q.defer();

          strata.problems(
            data,
            function (solutions) {
              deferred.resolve(solutions);
            },
            angular.bind(deferred, errorHandler),
            max
          );

          return deferred.promise;
        },
        solutions: {
          //solutions.get
          get: function (uri) {
            var deferred = $q.defer();

            strata.solutions.get(
              uri,
              function (solution) {
                deferred.resolve(solution);
              },
              function () {
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
          //products.list
          list: function () {
            var deferred = $q.defer();

            strata.products.list(
              function (response) {
                deferred.resolve(response);
              },
              angular.bind(deferred, errorHandler)
            );

            return deferred.promise;
          },
          //products.versions
          versions: function (productCode) {
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
          //groups.list
          list: function (ssoUserName) {
            var deferred = $q.defer();

            strata.groups.list(
              function (response) {
                deferred.resolve(response);
              },
              angular.bind(deferred, errorHandler),
              ssoUserName
            );

            return deferred.promise;
          },
          //groups.delete
          delete: function(groupNum) {
            var deferred = $q.defer();

            strata.groups.delete(
              groupNum,
              function (response) {
                deferred.resolve(response);
              },
              angular.bind(deferred, errorHandler)
            );

            return deferred.promise;
          },
          //groups.create
          create: function(groupName) {
            var deferred = $q.defer();

            strata.groups.create(
              groupName,
              function (response) {
                deferred.resolve(response);
              },
              angular.bind(deferred, errorHandler)
            );

            return deferred.promise;
          }
        },
        accounts: {
          //accounts.get
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
          //accounts.users
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
          //accounts.list
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
          //cases.csv
          csv: function() {
            var deferred = $q.defer();

            strata.cases.csv(
                function (response) {
                  deferred.resolve(response);
                },
                angular.bind(deferred, errorHandler)
            );

            return deferred.promise;
          },
          attachments: {
            //cases.attachments.list
            list: function (id) {
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
            //cases.attachments.post
            post: function (attachment, caseNumber) {
              var deferred = $q.defer();

              strata.cases.attachments.post(
                attachment,
                caseNumber,
                function (response, code, xhr) {
                  deferred.resolve(xhr.getResponseHeader('Location'));
                },
                angular.bind(deferred, errorHandler)
              );

              return deferred.promise;
            },
            //cases.attachments.delete
            delete: function (id, caseNumber) {

              var deferred = $q.defer();

              strata.cases.attachments.delete(
                id,
                caseNumber,
                function (response) {
                  deferred.resolve(response);
                },
                angular.bind(deferred, errorHandler)
              );

              return deferred.promise;
            }
          },
          comments: {
            //cases.comments.get
            get: function (id) {
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
            //cases.comments.post
            post: function (case_number, text, isDraft) {
              var deferred = $q.defer();

              strata.cases.comments.post(
                case_number, 
                {
                  'text': text,
                  'draft': isDraft === true ? 'true' : 'false'
                },
                function (response) {
                  deferred.resolve(response);
                },
                angular.bind(deferred, errorHandler)
              );

              return deferred.promise;
            },
            //cases.comments.put
            put: function(case_number, text, isDraft, comment_id) {
              var deferred = $q.defer();

              strata.cases.comments.update(
                case_number,
                {
                  'text': text,
                  'draft': isDraft === true ? 'true' : 'false',
                  'caseNumber': case_number,
                  'id': comment_id
                },
                comment_id,
                function(response) {
                  deferred.resolve(response);
                },
                angular.bind(deferred, errorHandler)
              );

              return deferred.promise;
            }
          },
          notified_users: {
            add: function(caseNumber, ssoUserName) {
              var deferred = $q.defer();

              strata.cases.notified_users.add(
                caseNumber,
                ssoUserName,
                function (response) {
                  deferred.resolve(response);
                },
                angular.bind(deferred, errorHandler)
              );

              return deferred.promise;
            },
            remove: function(caseNumber, ssoUserName) {
              var deferred = $q.defer();

              strata.cases.notified_users.remove(
                caseNumber,
                ssoUserName,
                function (response) {
                  deferred.resolve(response);
                },
                angular.bind(deferred, errorHandler)
              );

              return deferred.promise;
            }
          },
          //cases.get
          get: function (id) {
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
          //cases.filter
          filter: function (params) {
            var deferred = $q.defer();
            if (RHAUtils.isEmpty(params)) {
              params = {};
            }
            if (RHAUtils.isEmpty(params.count)) {
              params.count = 50;
            }

            strata.cases.filter(
              params,
              function (allCases) {
                deferred.resolve(allCases);
              },
              angular.bind(deferred, errorHandler)
            );

            return deferred.promise;
          },
          //cases.post
          post: function (caseJSON) {
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
          //cases.put
          put: function (case_number, caseJSON) {
            var deferred = $q.defer();

            strata.cases.put(
              case_number,
              caseJSON,
              function (response) {
                deferred.resolve(response);
              },
              angular.bind(deferred, errorHandler)
            );

            return deferred.promise;
          }
        },
        values: {
          cases: {
            //values.cases.severity
            severity: function () {
              var deferred = $q.defer();

              strata.values.cases.severity(
                function (response) {
                  deferred.resolve(response);
                },
                angular.bind(deferred, errorHandler)
              );

              return deferred.promise;
            },
            //values.cases.status
            status: function () {
              var deferred = $q.defer();

              strata.values.cases.status(
                function (response) {
                  deferred.resolve(response);
                },
                angular.bind(deferred, errorHandler)
              );

              return deferred.promise;
            },
            //values.cases.types
            types: function () {
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
    }
  ]);
