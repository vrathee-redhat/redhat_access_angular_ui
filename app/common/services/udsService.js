'use strict';
/*global navigator, strata, uds, angular*/
angular.module('RedhatAccess.common').factory('udsService', [
    '$q',
    'RHAUtils',
    '$angularCacheFactory',
    function ($q, RHAUtils, $angularCacheFactory) {
        var service = {
            cases: {
                list: function(uql) {
                    var deferred = $q.defer();
                    uds.fetchCases(
                        function (response) {
                            deferred.resolve(response);
                        },
                        function (error) {
                            deferred.reject(error);
                        },
                        uql
                    );
                    return deferred.promise;
                }
            },
            case:{
                details: {
                    get: function(caseNumber) {
                        var deferred = $q.defer();
                        uds.fetchCaseDetails(
                            function (response) {
                                deferred.resolve(response);
                            },
                            function (error) {
                                deferred.reject(error);
                            },
                            caseNumber
                        );
                        return deferred.promise;
                    }
                },
                comments:{
                    get: function(caseNumber) {
                        var deferred = $q.defer();
                        uds.fetchCaseComments(
                            function (response) {
                                deferred.resolve(response);
                            },
                            function (error) {
                                deferred.reject(error);
                            },
                            caseNumber
                        );
                        return deferred.promise;
                    }
                }
            },
            user:{
                details:function(ssoUsername){
                    var deferred = $q.defer();
                    uds.fetchUserDetails(
                        function (response) {
                            deferred.resolve(response);
                        },
                        function (error) {
                            deferred.reject(error);
                        },
                        ssoUsername
                    );
                    return deferred.promise;
                }
            }
        };
        return service;
    }
]);
