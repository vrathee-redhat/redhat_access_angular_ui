'use strict';
/*global strata, angular*/
/*jshint camelcase: false */
/*jshint unused:vars */

angular.module('RedhatAccess.common')
  .factory('strataService', ['$q', 'translate', 'RHAUtils', '$angularCacheFactory',
    function ($q, translate, RHAUtils, $angularCacheFactory) {

      $angularCacheFactory('strataCache', {

        // This cache can hold 1000 items
        capacity: 1000,

        // Items added to this cache expire after 15 minutes
        maxAge: 900000,

        // Items will be actively deleted when they expire
        deleteOnExpire: 'aggressive',

        // This cache will check for expired items every minute
        recycleFreq: 60000,

        // This cache will clear itself every hour
        cacheFlushInterval: 3600000,

        // This cache will sync itself with localStorage
        storageMode: 'sessionStorage',

        // Full synchronization with localStorage on every operation
        verifyIntegrity: true,

        // This callback is executed when the item specified by "key" expires.
        // At this point you could retrieve a fresh value for "key"
        // from the server and re-insert it into the cache.
        //onExpire: function (key, value) {
        //}
      });

      var strataCache = $angularCacheFactory.get('strataCache');

      var errorHandler = function (message, xhr, response, status) {

        var translatedMsg = message;

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
      var service = {
        authentication: {
          //authentication service
          checkLogin: function () {
            var deferred = $q.defer();

            if (strataCache.get("auth")) {
                deferred.resolve(strataCache.get("auth"));
            } else {
                strata.checkLogin(
                    function (result, authedUser) {
                    if (result) {
                        service.accounts.list().then(
                            function (accountNumber) {
                            service.accounts.get(accountNumber).then(
                                function (account) {
                                authedUser.account = account;
                                strataCache.put("auth", authedUser);
                                deferred.resolve(authedUser);
                            }
                            );
                        },
                        function (error) {
                            //TODO revisit this behavior
                            authedUser.account = undefined;
                            deferred.resolve(authedUser);
                        }
                        );
                    } else {
                        deferred.reject('Unauthorized.');
                    }
                });
            }
            return deferred.promise;
          },
          login: function (username, password) {

          }
        },
        entitlements: {
          //entitlements.get
          get: function (showAll, ssoUserName) {
            var deferred = $q.defer();

            if (strataCache.get("entitlements" + ssoUserName)) {
              deferred.resolve(strataCache.get("entitlements" + ssoUserName));
            } else {
              strata.entitlements.get(
                showAll,
                function (entitlements) {
                  strataCache.put("entitlements" + ssoUserName, entitlements);
                  deferred.resolve(entitlements);
                },
                angular.bind(deferred, errorHandler),
                ssoUserName
              );
            }

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

            if (strataCache.get("solution" + uri)) {
              deferred.resolve(strataCache.get("solution" + uri));
            } else {
              strata.solutions.get(
                uri,
                function (solution) {
                  strataCache.put("solution" + uri, solution);
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
            }

            return deferred.promise;
          }
        },
        products: {
          //products.list
          list: function (ssoUserName) {
            var deferred = $q.defer();

            if (strataCache.get("products" + ssoUserName)) {
              deferred.resolve(strataCache.get("products" + ssoUserName));
            } else {
              strata.products.list(
                function (response) {
                  strataCache.put("products" + ssoUserName, response);
                  deferred.resolve(response);
                },
                angular.bind(deferred, errorHandler),
                ssoUserName
              );
            }

            return deferred.promise;
          },
          //products.versions
          versions: function (productCode) {
            var deferred = $q.defer();

            if (strataCache.get("versions-" + productCode)) {
              deferred.resolve(strataCache.get("versions-" + productCode));
            } else {
              strata.products.versions(
                productCode,
                function (response) {
                  strataCache.put("versions-" + productCode, response);
                  deferred.resolve(response);
                },
                angular.bind(deferred, errorHandler)
              );
            }

            return deferred.promise;
          }
        },
        groups: {
          //groups.list
          list: function (ssoUserName) {
            var deferred = $q.defer();

            if (strataCache.get("groups" + ssoUserName)) {
              deferred.resolve(strataCache.get("groups" + ssoUserName));
            } else {
              strata.groups.list(
                function (response) {
                  strataCache.put("groups" + ssoUserName, response);
                  deferred.resolve(response);
                },
                angular.bind(deferred, errorHandler),
                ssoUserName
              );
            }

            return deferred.promise;
          },
          //groups.remove
          remove: function (groupNum) {
            var deferred = $q.defer();

            strata.groups.remove(
              groupNum,
              function (response) {
                deferred.resolve(response);
              },
              angular.bind(deferred, errorHandler)
            );

            return deferred.promise;
          },
          //groups.create
          create: function (groupName) {
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
          get: function (accountNumber) {
            var deferred = $q.defer();
            if (strataCache.get("account" + accountNumber)) {
              deferred.resolve(strataCache.get("account" + accountNumber));
            } else {
              strata.accounts.get(
                accountNumber,
                function (response) {
                  strataCache.put("account" + accountNumber, response);
                  deferred.resolve(response);
                },
                angular.bind(deferred, errorHandler)
              );
            }
            return deferred.promise;
          },
          //accounts.users
          users: function (accountNumber, group) {
            var deferred = $q.defer();
            if (strataCache.get("users" + accountNumber + group)) {
                deferred.resolve(strataCache.get("users" + accountNumber + group));
            } else {
              strata.accounts.users(
                accountNumber,
                function (response) {
                  strataCache.put("users" + accountNumber + group, response);
                  deferred.resolve(response);
                },
                angular.bind(deferred, errorHandler),
                group
              );
            }
            return deferred.promise;
          },
          //accounts.list
          list: function () {
            var deferred = $q.defer();
            if (strataCache.get("account")) {
              deferred.resolve(strataCache.get("account"));
            } else {
              strata.accounts.list(
                function (response) {
                  strataCache.put("account", response);
                  deferred.resolve(response);
                },
                angular.bind(deferred, errorHandler)
              );
            }
            return deferred.promise;
          }
        },
        cases: {
          //cases.csv
          csv: function () {
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

              if (strataCache.get("attachments" + id)) {
                deferred.resolve(strataCache.get("attachments" + id));
              } else {
                strata.cases.attachments.list(
                  id,
                  function (response) {
                    strataCache.put("attachments" + id, response);
                    deferred.resolve(response);
                  },
                  angular.bind(deferred, errorHandler)
                );
              }

              return deferred.promise;
            },
            //cases.attachments.post
            post: function (attachment, caseNumber) {
                var deferred = $q.defer();

                strata.cases.attachments.post(
                    attachment,
                    caseNumber,
                    function (response, code, xhr) {
                        strataCache.remove('attachments' + caseNumber);
                        deferred.resolve(xhr.getResponseHeader('Location'));
                    },
                    angular.bind(deferred, errorHandler)
                );

                return deferred.promise;
            },
            //cases.attachments.remove
            remove: function (id, caseNumber) {

              var deferred = $q.defer();

              strata.cases.attachments.remove(
                id,
                caseNumber,
                function (response) {
                  strataCache.remove('attachments' + caseNumber);
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

              if (strataCache.get("comments" + id)) {
                deferred.resolve(strataCache.get("comments" + id));
              } else {
                strata.cases.comments.get(
                  id,
                  function (response) {
                    strataCache.put("comments" + id, response);
                    deferred.resolve(response);
                  },
                  angular.bind(deferred, errorHandler)
                );
              }

              return deferred.promise;
            },
            //cases.comments.post
            post: function (case_number, text, isDraft) {
              var deferred = $q.defer();

              strata.cases.comments.post(
                case_number, {
                  'text': text,
                  'draft': isDraft === true ? 'true' : 'false'
                },
                function (response) {
                  strataCache.remove('comments' + case_number);
                  deferred.resolve(response);
                },
                angular.bind(deferred, errorHandler)
              );

              return deferred.promise;
            },
            //cases.comments.put
            put: function (case_number, text, isDraft, comment_id) {
              var deferred = $q.defer();

              strata.cases.comments.update(
                case_number, {
                  'text': text,
                  'draft': isDraft === true ? 'true' : 'false',
                  'caseNumber': case_number,
                  'id': comment_id
                },
                comment_id,
                function (response) {
                  strataCache.remove('comments' + case_number);
                  deferred.resolve(response);
                },
                angular.bind(deferred, errorHandler)
              );

              return deferred.promise;
            }
          },
          notified_users: {
            add: function (caseNumber, ssoUserName) {
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
            remove: function (caseNumber, ssoUserName) {
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

            if (strataCache.get("case" + id)) {
              deferred.resolve([strataCache.get("case" + id), true]);
            } else {
              strata.cases.get(
                id,
                function (response) {
                  strataCache.put("case" + id, response);
                  deferred.resolve([response, false]);
                },
                angular.bind(deferred, errorHandler)
              );
            }

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

            if (strataCache.get("filter" + JSON.stringify(params))) {
              deferred.resolve(strataCache.get("filter" + JSON.stringify(params)));
            } else {
              strata.cases.filter(
                params,
                function (allCases) {
                  strataCache.put("filter" + JSON.stringify(params), allCases);
                  deferred.resolve(allCases);
                },
                angular.bind(deferred, errorHandler)
              );
            }

            return deferred.promise;
          },
          //cases.post
          post: function (caseJSON) {
            var deferred = $q.defer();

            strata.cases.post(
              caseJSON,
              function (caseNumber) {
                //Remove any case filters that are cached
                for (var k in strataCache.keySet()){
                    if(~k.indexOf('filter')){
                      strataCache.remove(k);
                  }
                }
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
                strataCache.remove('case' + case_number);
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

              if (strataCache.get("severities")) {
                deferred.resolve(strataCache.get("severities"));
              } else {
                strata.values.cases.severity(
                  function (response) {
                    strataCache.put("severities", response);
                    deferred.resolve(response);
                  },
                  angular.bind(deferred, errorHandler)
                );
              }

              return deferred.promise;
            },
            //values.cases.status
            status: function () {
              var deferred = $q.defer();
              if (strataCache.get("statuses")) {
                deferred.resolve(strataCache.get("statuses"));
              } else {
                strata.values.cases.status(
                  function (response) {
                    strataCache.put("statuses", response);
                    deferred.resolve(response);
                  },
                  angular.bind(deferred, errorHandler)
                );
              }

              return deferred.promise;
            },
            //values.cases.types
            types: function () {
              var deferred = $q.defer();

              if (strataCache.get("types")) {
                deferred.resolve(strataCache.get("types"));
              } else {
                strata.values.cases.types(
                  function (response) {
                    strataCache.put("types", response);
                    deferred.resolve(response);
                  },
                  angular.bind(deferred, errorHandler)
                );
              }

              return deferred.promise;
            }
          }
        }
      };
      return service;
    }
  ]);
