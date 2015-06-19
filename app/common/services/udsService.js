'use strict';
/*global navigator, strata, uds, angular*/
angular.module('RedhatAccess.common').factory('udsService', [
    '$q',
    'RHAUtils',
    '$angularCacheFactory',
    function ($q, RHAUtils, $angularCacheFactory) {
        function mapResponseObject(isCase,isComment,isEntitlement,isUser,isSolution,response) {
            // we will also have to check for undefined and null objects in response before assigning.
            if(isCase === true) {
                var kase = {};
                kase.case_number = response.resource.caseNumber;
                kase.status = {};
                kase.status.name = response.resource.status;
                kase.summary = response.resource.subject;
                kase.severity = {};
                kase.severity.name = response.resource.severity;
                kase.product = response.resource.product.resource.line.resource.name;
                if(response.resource.product.resource.version != undefined) {
                    kase.version = response.resource.product.resource.version.resource.name;
                }
                kase.description = response.resource.description;
                kase.sbr_group = '';
                if(response.resource.sbrs !== undefined && response.resource.sbrs.length > 0) {
                    for(var i = 0; i < response.resource.sbrs.length; i++) {
                        kase.sbr_group = kase.sbr_group.concat(response.resource.sbrs[i]);
                        if(i < (response.resource.sbrs.length-1)) {
                            kase.sbr_group = kase.sbr_group.concat(' , ');
                        }
                    }
                }
                kase.type = '';
                kase.created_by = response.resource.createdBy.resource.fullName;
                kase.last_modified_by = response.resource.createdBy.resource.fullName;
                kase.internal_priority = response.resource.internalPriority;
                kase.is_fts_case = response.resource.isFTSCase;
                kase.account = {};
                kase.account.account_number = response.resource.account.resource.accountNumber;
                kase.account.is_strategic = response.resource.account.resource.strategic;
                kase.account.special_handling_required = response.resource.account.resource.specialHandlingRequired;
                if(response.resource.resolution)
                {
                    kase.resolution=response.resource.resolution;
                }
                else
                {
                    kase.resolution='';
                }
                kase.entitlement={};
                kase.entitlement.name=response.resource.entitlement.resource.name;
                kase.entitlement.status=response.resource.entitlement.resource.status;
                kase.entitlement.service_level=response.resource.entitlement.resource.serviceLevel;
                kase.sbt=response.resource.sbt;
                kase.target_date_time=response.resource.targetDate;
                kase.resourceLinks = response.resource.resourceLinks;
                return kase;
            } else if(isComment === true) {
                var comments = {};
                return comments;
            } else if(isEntitlement === true) {
                var entitlement = {};
                return entitlement;
            } else if(isUser === true) {
                var user = {};
                return user;
            } else if(isSolution == true) {
                var solutions = {};
                return solutions;
            }
        };
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
                                if (response.resource !== undefined) {
                                    response=mapResponseObject(true,false,false,false,false,response);
                                } else {
                                    response=[];
                                }
                                var targetDate= RHAUtils.convertToTimezone(response.target_date_time);
                                response.target_date = RHAUtils.formatDate(targetDate, 'MMM DD YYYY hh:mm:ss A Z');
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
            account:{
                get:function(accountNumber){
                    var deferred = $q.defer();
                    uds.fetchAccountDetails(
                        function (response) {
                            deferred.resolve(response);
                        },
                        function (error) {
                            deferred.reject(error);
                        },
                        accountNumber
                    );
                    return deferred.promise;
                },
                notes:function(accountNumber){
                    var deferred = $q.defer();
                    uds.fetchAccountNotes(
                        function (response) {
                            deferred.resolve(response);
                        },
                        function (error) {
                            deferred.reject(error);
                        },
                        accountNumber
                    );
                    return deferred.promise;

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
