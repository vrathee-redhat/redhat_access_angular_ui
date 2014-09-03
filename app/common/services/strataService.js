'use strict';
/*global navigator, strata, angular*/
/*jshint camelcase: false */
/*jshint bitwise: false */
/*jshint unused:vars */
angular.module('RedhatAccess.common').factory('strataService', [
    '$q',
    'translate',
    'RHAUtils',
    '$angularCacheFactory',
    function ($q, translate, RHAUtils, $angularCacheFactory) {
        $angularCacheFactory('strataCache', {
            capacity: 1000,
            maxAge: 900000,
            deleteOnExpire: 'aggressive',
            recycleFreq: 60000,
            cacheFlushInterval: 3600000,
            storageMode: 'sessionStorage',
            verifyIntegrity: true
        });
        var ie8 = false;
        if (navigator.appVersion.indexOf('MSIE 8.') !== -1) {
            ie8 = true;
        }
        var strataCache;
        if (!ie8) {
            strataCache = $angularCacheFactory.get('strataCache');
        }
        var errorHandler = function (message, xhr, response, status) {
            var translatedMsg = message;
            switch (status) {
            case 'Unauthorized':
                translatedMsg = translate('Unauthorized.');
                break;    // case n:
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
                    checkLogin: function () {
                        var deferred = $q.defer();
                        if (!ie8 && strataCache.get('auth')) {
                            deferred.resolve(strataCache.get('auth'));
                        } else {
                            strata.checkLogin(function (result, authedUser) {
                                if (result) {
                                    service.accounts.list().then(function (accountNumber) {
                                        service.accounts.get(accountNumber).then(function (account) {
                                            authedUser.account = account;
                                            if (!ie8) {
                                                strataCache.put('auth', authedUser);
                                            }
                                            deferred.resolve(authedUser);
                                        });
                                    }, function (error) {
                                        //TODO revisit this behavior
                                        authedUser.account = undefined;
                                        deferred.resolve(authedUser);
                                    });
                                } else {
                                    deferred.reject('Unauthorized.');
                                }
                            });
                        }
                        return deferred.promise;
                    },
                    setCredentials: function (username, password) {
                        return strata.setCredentials(username,password);
                    },
                    logout: function (){
                        if(!ie8) {
                            strataCache.removeAll();
                        }
                        strata.clearCredentials();
                    }
                },
                entitlements: {
                    get: function (showAll, ssoUserName) {
                        var deferred = $q.defer();
                        if (!ie8 && strataCache.get('entitlements' + ssoUserName)) {
                            deferred.resolve(strataCache.get('entitlements' + ssoUserName));
                        } else {
                            strata.entitlements.get(showAll, function (entitlements) {
                                if (!ie8) {
                                    strataCache.put('entitlements' + ssoUserName, entitlements);
                                }
                                deferred.resolve(entitlements);
                            }, angular.bind(deferred, errorHandler), ssoUserName);
                        }
                        return deferred.promise;
                    }
                },
                problems: function (data, max) {
                    var deferred = $q.defer();
                    strata.problems(data, function (solutions) {
                        deferred.resolve(solutions);
                    }, angular.bind(deferred, errorHandler), max);
                    return deferred.promise;
                },
                recommendations: function (data, max) {
                    var deferred = $q.defer();
                    strata.recommendations(data, function (recommendations) {
                        deferred.resolve(recommendations);
                    }, angular.bind(deferred, errorHandler), max);
                    return deferred.promise;
                },
                solutions: {
                    get: function (uri) {
                        var deferred = $q.defer();
                        if (!ie8 && strataCache.get('solution' + uri)) {
                            deferred.resolve(strataCache.get('solution' + uri));
                        } else {
                            strata.solutions.get(uri, function (solution) {
                                if (!ie8) {
                                    strataCache.put('solution' + uri, solution);
                                }
                                deferred.resolve(solution);
                            }, function () {
                                //workaround for 502 from strata
                                //If the deferred is rejected then the parent $q.all()
                                //based deferred will fail. Since we don't need every
                                //recommendation just send back undefined
                                //and the caller can ignore the missing solution details.
                                deferred.resolve();
                            });
                        }
                        return deferred.promise;
                    }
                },
                products: {
                    list: function (ssoUserName) {
                        var deferred = $q.defer();
                        if (!ie8 && strataCache.get('products' + ssoUserName)) {
                            deferred.resolve(strataCache.get('products' + ssoUserName));
                        } else {
                            strata.products.list(function (response) {
                                if (!ie8) {
                                    strataCache.put('products' + ssoUserName, response);
                                }
                                deferred.resolve(response);
                            }, angular.bind(deferred, errorHandler), ssoUserName);
                        }
                        return deferred.promise;
                    },
                    versions: function (productCode) {
                        var deferred = $q.defer();
                        if (!ie8 && strataCache.get('versions-' + productCode)) {
                            deferred.resolve(strataCache.get('versions-' + productCode));
                        } else {
                            strata.products.versions(productCode, function (response) {
                                if (!ie8) {
                                    strataCache.put('versions-' + productCode, response);
                                }
                                deferred.resolve(response);
                            }, angular.bind(deferred, errorHandler));
                        }
                        return deferred.promise;
                    }
                },
                groups: {
                    list: function (ssoUserName) {
                        var deferred = $q.defer();
                        if (!ie8 && strataCache.get('groups' + ssoUserName)) {
                            deferred.resolve(strataCache.get('groups' + ssoUserName));
                        } else {
                            strata.groups.list(function (response) {
                                if (!ie8) {
                                    strataCache.put('groups' + ssoUserName, response);
                                }
                                deferred.resolve(response);
                            }, angular.bind(deferred, errorHandler), ssoUserName);
                        }
                        return deferred.promise;
                    },
                    remove: function (groupNum) {
                        var deferred = $q.defer();
                        strata.groups.remove(groupNum, function (response) {
                            deferred.resolve(response);
                        }, angular.bind(deferred, errorHandler));
                        return deferred.promise;
                    },
                    create: function (groupName) {
                        var deferred = $q.defer();
                        strata.groups.create(groupName, function (response) {
                            deferred.resolve(response);
                        }, angular.bind(deferred, errorHandler));
                        return deferred.promise;
                    }
                },
                accounts: {
                    get: function (accountNumber) {
                        var deferred = $q.defer();
                        if (!ie8 && strataCache.get('account' + accountNumber)) {
                            deferred.resolve(strataCache.get('account' + accountNumber));
                        } else {
                            strata.accounts.get(accountNumber, function (response) {
                                if (!ie8) {
                                    strataCache.put('account' + accountNumber, response);
                                }
                                deferred.resolve(response);
                            }, angular.bind(deferred, errorHandler));
                        }
                        return deferred.promise;
                    },
                    users: function (accountNumber, group) {
                        var deferred = $q.defer();
                        if (!ie8 && strataCache.get('users' + accountNumber + group)) {
                            deferred.resolve(strataCache.get('users' + accountNumber + group));
                        } else {
                            strata.accounts.users(accountNumber, function (response) {
                                if (!ie8) {
                                    strataCache.put('users' + accountNumber + group, response);
                                }
                                deferred.resolve(response);
                            }, angular.bind(deferred, errorHandler), group);
                        }
                        return deferred.promise;
                    },
                    list: function () {
                        var deferred = $q.defer();
                        if (!ie8 && strataCache.get('account')) {
                            deferred.resolve(strataCache.get('account'));
                        } else {
                            strata.accounts.list(function (response) {
                                if (!ie8) {
                                    strataCache.put('account', response);
                                }
                                deferred.resolve(response);
                            }, angular.bind(deferred, errorHandler));
                        }
                        return deferred.promise;
                    }
                },
                cases: {
                    csv: function () {
                        var deferred = $q.defer();
                        strata.cases.csv(function (response) {
                            deferred.resolve(response);
                        }, angular.bind(deferred, errorHandler));
                        return deferred.promise;
                    },
                    attachments: {
                        list: function (id) {
                            var deferred = $q.defer();
                            if (!ie8 && strataCache.get('attachments' + id)) {
                                deferred.resolve(strataCache.get('attachments' + id));
                            } else {
                                strata.cases.attachments.list(id, function (response) {
                                    if (!ie8) {
                                        strataCache.put('attachments' + id, response);
                                    }
                                    deferred.resolve(response);
                                }, angular.bind(deferred, errorHandler));
                            }
                            return deferred.promise;
                        },
                        post: function (attachment, caseNumber) {
                            var deferred = $q.defer();
                            strata.cases.attachments.post(attachment, caseNumber, function (response, code, xhr) {
                                if (!ie8) {
                                    strataCache.remove('attachments' + caseNumber);
                                }
                                deferred.resolve(xhr.getResponseHeader('Location'));
                            }, angular.bind(deferred, errorHandler));
                            return deferred.promise;
                        },
                        remove: function (id, caseNumber) {
                            var deferred = $q.defer();
                            strata.cases.attachments.remove(id, caseNumber, function (response) {
                                if (!ie8) {
                                    strataCache.remove('attachments' + caseNumber);
                                }
                                deferred.resolve(response);
                            }, angular.bind(deferred, errorHandler));
                            return deferred.promise;
                        }
                    },
                    comments: {
                        get: function (id) {
                            var deferred = $q.defer();
                            if (!ie8 && strataCache.get('comments' + id)) {
                                deferred.resolve(strataCache.get('comments' + id));
                            } else {
                                strata.cases.comments.get(id, function (response) {
                                    if (!ie8) {
                                        strataCache.put('comments' + id, response);
                                    }
                                    deferred.resolve(response);
                                }, angular.bind(deferred, errorHandler));
                            }
                            return deferred.promise;
                        },
                        post: function (caseNumber, text, isDraft) {
                            var deferred = $q.defer();
                            strata.cases.comments.post(caseNumber, {
                                'text': text,
                                'draft': isDraft === true ? 'true' : 'false'
                            }, function (response) {
                                if (!ie8) {
                                    strataCache.remove('comments' + caseNumber);
                                }
                                deferred.resolve(response);
                            }, angular.bind(deferred, errorHandler));
                            return deferred.promise;
                        },
                        put: function (caseNumber, text, isDraft, comment_id) {
                            var deferred = $q.defer();
                            strata.cases.comments.update(caseNumber, {
                                'text': text,
                                'draft': isDraft === true ? 'true' : 'false',
                                'caseNumber': caseNumber,
                                'id': comment_id
                            }, comment_id, function (response) {
                                if (!ie8) {
                                    strataCache.remove('comments' + caseNumber);
                                }
                                deferred.resolve(response);
                            }, angular.bind(deferred, errorHandler));
                            return deferred.promise;
                        }
                    },
                    notified_users: {
                        add: function (caseNumber, ssoUserName) {
                            var deferred = $q.defer();
                            strata.cases.notified_users.add(caseNumber, ssoUserName, function (response) {
                                deferred.resolve(response);
                            }, angular.bind(deferred, errorHandler));
                            return deferred.promise;
                        },
                        remove: function (caseNumber, ssoUserName) {
                            var deferred = $q.defer();
                            strata.cases.notified_users.remove(caseNumber, ssoUserName, function (response) {
                                deferred.resolve(response);
                            }, angular.bind(deferred, errorHandler));
                            return deferred.promise;
                        }
                    },
                    get: function (id) {
                        var deferred = $q.defer();
                        if (!ie8 && strataCache.get('case' + id)) {
                            deferred.resolve([
                                strataCache.get('case' + id),
                                true
                            ]);
                        } else {
                            strata.cases.get(id, function (response) {
                                if (!ie8) {
                                    strataCache.put('case' + id, response);
                                }
                                deferred.resolve([
                                    response,
                                    false
                                ]);
                            }, angular.bind(deferred, errorHandler));
                        }
                        return deferred.promise;
                    },
                    filter: function (params) {
                        var deferred = $q.defer();
                        if (RHAUtils.isEmpty(params)) {
                            params = {};
                        }
                        if (RHAUtils.isEmpty(params.count)) {
                            params.count = 50;
                        }
                        if (!ie8 && strataCache.get('filter' + JSON.stringify(params))) {
                            deferred.resolve(strataCache.get('filter' + JSON.stringify(params)));
                        } else {
                            strata.cases.filter(params, function (allCases) {
                                if (!ie8) {
                                    strataCache.put('filter' + JSON.stringify(params), allCases);
                                }
                                deferred.resolve(allCases);
                            }, angular.bind(deferred, errorHandler));
                        }
                        return deferred.promise;
                    },
                    post: function (caseJSON) {
                        var deferred = $q.defer();
                        strata.cases.post(caseJSON, function (caseNumber) {
                            //Remove any case filters that are cached
                            if (!ie8) {
                                for (var k in strataCache.keySet()) {
                                    if (~k.indexOf('filter')) {
                                        strataCache.remove(k);
                                    }
                                }
                            }
                            deferred.resolve(caseNumber);
                        }, angular.bind(deferred, errorHandler));
                        return deferred.promise;
                    },
                    put: function (caseNumber, caseJSON) {
                        var deferred = $q.defer();
                        strata.cases.put(caseNumber, caseJSON, function (response) {
                            if (!ie8) {
                                strataCache.remove('case' + caseNumber);
                            }
                            deferred.resolve(response);
                        }, angular.bind(deferred, errorHandler));
                        return deferred.promise;
                    }
                },
                values: {
                    cases: {
                        severity: function () {
                            var deferred = $q.defer();
                            if (!ie8 && strataCache.get('severities')) {
                                deferred.resolve(strataCache.get('severities'));
                            } else {
                                strata.values.cases.severity(function (response) {
                                    if (!ie8) {
                                        strataCache.put('severities', response);
                                    }
                                    deferred.resolve(response);
                                }, angular.bind(deferred, errorHandler));
                            }
                            return deferred.promise;
                        },
                        status: function () {
                            var deferred = $q.defer();
                            if (!ie8 && strataCache.get('statuses')) {
                                deferred.resolve(strataCache.get('statuses'));
                            } else {
                                strata.values.cases.status(function (response) {
                                    if (!ie8) {
                                        strataCache.put('statuses', response);
                                    }
                                    deferred.resolve(response);
                                }, angular.bind(deferred, errorHandler));
                            }
                            return deferred.promise;
                        },
                        types: function () {
                            var deferred = $q.defer();
                            if (!ie8 && strataCache.get('types')) {
                                deferred.resolve(strataCache.get('types'));
                            } else {
                                strata.values.cases.types(function (response) {
                                    if (!ie8) {
                                        strataCache.put('types', response);
                                    }
                                    deferred.resolve(response);
                                }, angular.bind(deferred, errorHandler));
                            }
                            return deferred.promise;
                        }
                    }
                }
            };
        return service;
    }
]);
