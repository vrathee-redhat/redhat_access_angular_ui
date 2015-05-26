'use strict';
/*global navigator, strata, uds, angular*/
angular.module('RedhatAccess.common').factory('udsService', [
    '$q',
    'RHAUtils',
    '$angularCacheFactory',
    function ($q, RHAUtils, $angularCacheFactory) {
        var service = {
            cases: {
                list: function(uql,resourceProjection,limit) {
                    var deferred = $q.defer();
                    uds.fetchCases(
                        function (response) {
                            deferred.resolve(response);
                        },
                        function (error) {
                            deferred.reject(error);
                        },
                        uql,
                        resourceProjection,
                        limit
                    );
                    return deferred.promise;
                }
            },
            kase:{
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
                                angular.forEach(response, angular.bind(this, function (comment) {
                                    var lastModifiedDate = RHAUtils.convertToTimezone(comment.resource.lastModified);
                                    var modifiedDate=comment.resource.lastModified;
                                    comment.resource.sortModifiedDate=modifiedDate;
                                    comment.resource.last_modified_date = RHAUtils.formatDate(lastModifiedDate, 'MMM DD YYYY');
                                    comment.resource.last_modified_time = RHAUtils.formatDate(lastModifiedDate, 'hh:mm A Z');
                                    var createdDate = RHAUtils.convertToTimezone(comment.resource.created);
                                    comment.resource.created_date = RHAUtils.formatDate(createdDate, 'MMM DD YYYY');
                                    comment.resource.created_time = RHAUtils.formatDate(createdDate, 'hh:mm A Z');
                                }));
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
                get:function(uql){
                    var deferred = $q.defer();
                    uds.fetchUser(
                        function (response) {
                            deferred.resolve(response);
                        },
                        function (error) {
                            deferred.reject(error);
                        },
                        uql
                    );
                    return deferred.promise
                },
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
