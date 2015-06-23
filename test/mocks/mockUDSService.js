'use strict';
angular.module('RedhatAccess.mockUDS', [])
.service('MockUDSDataService', [
    function () {
        this.yourCases = [{
            "resource":{
                "caseNumber":1278378,
                "status":"Waiting on Customer",
                "internalStatus":"Waiting on Customer",
                "severity":"2 (High)",
                "internalPriority":"2 (High)",
                "collaborationScore":1000
            },
            "resourceReliability":"Fresh",
            "externalModelId":"500A000000OU9hWIAT"
        },
            {
                "resource":{
                    "caseNumber":1286251,
                    "status":"Waiting on Customer",
                    "internalStatus":"Waiting on Customer",
                    "severity":"2 (High)",
                    "internalPriority":"2 (High)",
                    "collaborationScore":2000
                },
                "resourceReliability":"Fresh",
                "externalModelId":"500A000000OU9hWIAT"
            }];
        this.mockCase = {
            "caseNumber":1286251,
            "status":{
                "name":"Waiting on Red Hat"
            },
            "internalStatus":"Waiting on Collaboration",
            "severity":"2 (High)",
            "internalPriority":"2 (High)",
            "sbrs":["SysMgmt"],
            "subject":"Test subject.",
            "description":"Test description",
            "sbt": -234050
        };
        this.mockUser = [{
            "resource": {
                "fullName":"test, test",
                "email":
                    [{"address":"pbathia@redhat.com","addressType":"PRIMARY"},{"address":"pbathia@redhat.com","addressType":"OTHER"}],
                "sso":["rhn-support-pbathia"],
                "gss":false,
                "superRegion":null,
                "timezone":"America/New_York",
                "firstName":"test",
                "lastName":"test",
                "aliasName":"test",
                "kerberos":"test",
                "salesforce":"test@redhat.com",
                "isManager":false,
                "active":true,
                "created":"2014-11-06T13:50:58.000-05:00",
                "lastLogin":"2014-12-09T10:11:47.000-05:00",
                "lastModified":"2014-11-06T13:50:58.000-05:00",
                "outOfOffice":false,
                "roles":
                    [{
                        "resource":{
                            "name":"ascension-fts",
                            "description":"Ascension - FTS",
                            "sbrs":["Virtualization"],
                            "superRegion":"India"},
                        "resourceReliability":"Fresh",
                        "externalModelId":40}],
                "sbrs":["Virtualization"],
                "hireDate":"2014-10-06T00:00:00.000-04:00"},
            "resourceReliability":"Fresh",
            "externalModelId":"005A0000005mfwIIAQ"
        }];
        this.mockAccount = {
            "resource":{
                "accountNumber":651570,
                "accountName":"Draper Laboratory",
                "superRegion":"NA",
                "isActive":true,
                "strategic":true,
                "hasSRM":true,
                "hasTAM":false,
                "specialHandlingRequired":false,
                "businessHours":{
                    "resource":{
                        "name":"GMT-5:00",
                        "timeZone":"America/New_York",
                        "isActive":true,"isDefault":false,
                        "mondayStartTime":"1970-01-01T04:00:00.000-05:00",
                        "mondayEndTime":"1970-01-01T13:00:00.000-05:00",
                        "tuesdayStartTime":"1970-01-01T04:00:00.000-05:00",
                        "tuesdayEndTime":"1970-01-01T13:00:00.000-05:00",
                        "wednesdayStartTime":"1970-01-01T04:00:00.000-05:00",
                        "wednesdayEndTime":"1970-01-01T13:00:00.000-05:00",
                        "thursdayStartTime":"1970-01-01T04:00:00.000-05:00",
                        "thursdayEndTime":"1970-01-01T13:00:00.000-05:00",
                        "fridayStartTime":"1970-01-01T04:00:00.000-05:00",
                        "fridayEndTime":"1970-01-01T13:00:00.000-05:00"},
                    "resourceReliability":"Fresh",
                    "externalModelId":"01mA0000000L3cVIAS"}},
            "resourceReliability":"Fresh",
            "externalModelId":"001A000000K7OxhIAF"
        }
    }
])
    .service('udsService', [
        'MockUDSDataService',
        '$q',
        function (MockUDSDataService, $q) {
            this.rejectCall = false;
            this.returnNull = false;
            var that = this;

            return {
                cases: {
                    list: function (uql, resourceProjection, limit) {
                        var deferred = $q.defer();
                        if (that.rejectCall) {
                            deferred.reject();
                        } else {
                            deferred.resolve(MockUDSDataService.yourCases);
                        }
                        return deferred.promise;
                    }
                },
                kase:{
                    details:{
                        get: function(caseNumber) {
                            var deferred = $q.defer();
                            if (that.rejectCall) {
                                deferred.reject();
                            } else {
                                deferred.resolve(MockUDSDataService.mockCase);
                            }
                            return deferred.promise;
                        }
                    },
                    comments:{
                        get: function(caseNumber) {
                            var deferred = $q.defer();
                            if (that.rejectCall) {
                                deferred.reject();
                            } else {
                                //deferred.resolve(MockUDSDataService.mockCase);
                            }
                            return deferred.promise;
                        }
                    }
                },
                user: {
                    get: function (uql) {
                        var deferred = $q.defer();
                        if (that.rejectCall) {
                            deferred.reject();
                        } else {
                            deferred.resolve(MockUDSDataService.mockUser);
                        }
                        return deferred.promise;
                    },
                    details: function (ssoUsername) {
                        var deferred = $q.defer();
                        if (that.rejectCall) {
                            deferred.reject();
                        } else {
                            // deferred.resolve(MockUDSDataService.mockCase);
                        }
                        return deferred.promise;
                    }
                },
                account:{
                    get:function (accountNumber) {
                        var deferred = $q.defer();
                        if (that.rejectCall) {
                            deferred.reject();
                        } else {
                            deferred.resolve(MockUDSDataService.mockAccount);
                        }
                        return deferred.promise;
                    },
                    notes:function (accountNumber) {
                        var deferred = $q.defer();
                        if (that.rejectCall) {
                            deferred.reject();
                        } else {
                            // deferred.resolve(MockUDSDataService.mockCase);
                        }
                        return deferred.promise;
                    }
                },
                rejectCalls: function () {
                    that.rejectCall = true;
                },
                returnNull: function () {
                    that.returnNull = true;
                }
            };
        }
    ]);
