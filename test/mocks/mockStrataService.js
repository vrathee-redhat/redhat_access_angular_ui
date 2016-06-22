'use strict';

angular.module('RedhatAccess.mock', [])
    .service('MockStrataDataService', [

        function () {
            this.mockGroups = [{
                "number": "80437",
                "name": "sfWdBWa6La",
                "is_private": false,
                "is_default": false,
                "selected": true,
                "masterSelected":true
            }, {
                "number": "49496",
                "name": "groupTest:1398506570363",
                "is_private": false,
                "is_default": true,
                "selected": false,
                "masterSelected":false
            }];

            this.mockFileSize="5000";

            this.mockUsers = [{
                "title": "Denises Hughes",
                "type": "application/vnd.redhat.user",
                "sso_username": "dhughesgit",
                "write":true
            }, {
                "title": "Customer Portal-Qa",
                "type": "application/vnd.redhat.user",
                "sso_username": "customerportalQA",
                "write":true
            }];

            this.mockComments = [{
                "created_by": "Robinson, David",
                "created_date": 1205811351000,
                "text": "comment1",
                "draft": false,
                "id": 1234
            }, {
                "created_by": "Napolis, Michael",
                "created_date": 1205370090000,
                "text": "comment2",
                "draft": true,
                "id": 2345
            }];

            this.mockExternalUpdates=[
                {
                    "created_by": "Napolis, Michael",
                    "created_date":1446203646000,
                    "visibility":"Partner Only",
                    "originating_system":"Microsoft",
                    "body":"asdfasfsaf",
                    "case_number":"01517592",
                    "originating_system_last_updated_at":1446202933000
                },
                {
                    "created_by": "Robinson, David",
                    "created_date":1446203292000,
                    "visibility":"Customer And Partner",
                    "originating_system":"Microsoft",
                    "body":"asdsadsad",
                    "case_number":"01517592",
                    "originating_system_last_updated_at":1446202855000
                }
            ];

            this.mockFilterCase = {"total_count":1,"case":[{"created_by":"Spenser Shumaker","created_date":1411656201000,"last_modified_by":"Spenser Shumaker","last_modified_date":1411656206000,"id":"500K0000006wLIRIA2","uri":"https://api.access.devgssci.devlab.phx1.redhat.com/rs/cases/01592512","summary":"test","description":"test","status":"Waiting on Red Hat","product":"JBoss Enterprise Web Platform","version":"5.1.0","account_number":"540155","escalated":false,"contact_name":"Spenser Shumaker","contact_sso_username":"rhn-support-sshumake","origin":"API","owner":"New Case Queue","severity":"4 (Low)","folder_number":"817","comments":{"comment":[{"created_by":"Shumaker, Spenser","created_date":1411672167000,"last_modified_by":"Shumaker, Spenser","last_modified_date":1411672166000,"text":"yr","draft":false,"published_date":1411672166000,"id":"a0aK0000004mqlxIAA","public":false}]},"notified_users":{},"entitlement":{"sla":"PREMIUM"},"fts":false,"bugzillas":{},"sbr_groups":{"sbr_group":["JBoss Base AS"]},"language":"fr","case_number":"01592512","closed":false}]}

            this.mockFilterCaseResult = [{"created_by":"Spenser Shumaker","created_date":1411656201000,"last_modified_by":"Spenser Shumaker","last_modified_date":1411656206000,"id":"500K0000006wLIRIA2","uri":"https://api.access.devgssci.devlab.phx1.redhat.com/rs/cases/01592512","summary":"test","description":"test","status":"Waiting on Red Hat","product":"JBoss Enterprise Web Platform","version":"5.1.0","account_number":"540155","escalated":false,"contact_name":"Spenser Shumaker","contact_sso_username":"rhn-support-sshumake","origin":"API","owner":"New Case Queue","severity":"4 (Low)","folder_number":"817","comments":{"comment":[{"created_by":"Shumaker, Spenser","created_date":1411672167000,"last_modified_by":"Shumaker, Spenser","last_modified_date":1411672166000,"text":"yr","draft":false,"published_date":1411672166000,"id":"a0aK0000004mqlxIAA","public":false}]},"notified_users":{},"entitlement":{"sla":"PREMIUM"},"fts":false,"bugzillas":{},"sbr_groups":{"sbr_group":["JBoss Base AS"]},"language":"fr","case_number":"01592512","closed":false}]
            this.mockCases = [
                [{
                    "created_by": "Sunil Keshari",
                    "created_date": 1405416971000,
                    "last_modified_by": "Sunil Keshari",
                    "last_modified_date": 1405416972000,
                    "id": "500K0000006FeAaIAK",
                    "uri": "https://api.access.devgssci.devlab.phx1.redhat.com/rs/cases/01364190",
                    "summary": "test case notified users",
                    "description": "test",
                    "status": "Waiting on Red Hat",
                    "product": {
                        "name": "Red Hat Enterprise Linux",
                        "value": "RHEL"
                    },
                    "version": "7.0",
                    "account_number": "940527",
                    "escalated": false,
                    "contact_name": "Sunil Keshari",
                    "contact_sso_username": "skesharigit",
                    "origin": "Web",
                    "owner": "New Case Queue",
                    "severity": "4 (Low)",
                    "comments": {},
                    "notified_users": {},
                    "entitlement": {
                        "sla": "UNKNOWN"
                    },
                    "fts": false,
                    "bugzillas": {},
                    "sbr_groups": {},
                    "case_number": "01364190",
                    "closed": false,
                    "selected":false
                },
                    false
                ], {
                    "created_by": "Sunil Keshari",
                    "created_date": 1405340814000,
                    "last_modified_by": "Sunil Keshari",
                    "last_modified_date": 1405340815000,
                    "id": "500K0000006FMC3IAO",
                    "uri": "https://api.access.devgssci.devlab.phx1.redhat.com/rs/cases/01359975",
                    "summary": "another test case",
                    "description": "test test",
                    "status": "Waiting on Red Hat",
                    "product": "JBoss Web Framework Kit",
                    "version": "1.1.0",
                    "account_number": "940527",
                    "escalated": false,
                    "contact_name": "Sunil Keshari",
                    "contact_sso_username": "skesharigit",
                    "origin": "API",
                    "owner": "New Case Queue",
                    "severity": "4 (Low)",
                    "comments": {},
                    "notified_users": {},
                    "entitlement": {
                        "sla": "UNKNOWN"
                    },
                    "fts": false,
                    "bugzillas": {},
                    "sbr_groups": {},
                    "case_number": "01359975",
                    "closed": false,
                    "selected":true,
                    "group": {"number":"685","name":"RBS"}
                }, {
                    "created_by": "Sunil Keshari",
                    "created_date": 1405340608000,
                    "last_modified_by": "Sunil Keshari",
                    "last_modified_date": 1405340613000,
                    "id": "500K0000006FM7dIAG",
                    "uri": "https://api.access.devgssci.devlab.phx1.redhat.com/rs/cases/01359974",
                    "summary": "test case",
                    "description": "test case",
                    "status": "Waiting on Red Hat",
                    "product": "Red Hat Enterprise Linux",
                    "version": "6.0",
                    "account_number": "940527",
                    "escalated": false,
                    "contact_name": "Sunil Keshari",
                    "contact_sso_username": "skesharigit",
                    "origin": "API",
                    "owner": "New Case Queue",
                    "severity": "4 (Low)",
                    "comments": {},
                    "notified_users": {},
                    "entitlement": {
                        "sla": "UNKNOWN"
                    },
                    "fts": false,
                    "bugzillas": {},
                    "sbr_groups": {},
                    "case_number": "01359974",
                    "closed": false,
                    "selected":false
                }
            ];

            this.mockEntitlements = {
                "standard": 'STANDARD',
                "premium": 'PREMIUM'
            };

            this.mockRecommendationPinned = {
                "linked": false,
                "pinned": true,
                "last_suggested_date": 1398756627000,
                "lucene_score": 141.0,
                "resource_id": "27450",
                "resource_type": "Solution",
                "resource_uri": "https://api.access.devgssci.devlab.phx1.redhat.com/rs/solutions/27450",
                "solution_title": " test solution title 1 ",
                "solution_abstract": "test solution abstract 1",
                "solution_url": "https://api.access.devgssci.devlab.phx1.redhat.com/rs/solutions/27450",
                "title": "test title 1",
                "solution_case_count": 3
            };

            this.mockSolutionNotPinned = {
                "linked": false,
                "pinned": false,
                "last_suggested_date": 1398756627000,
                "lucene_score": 141.0,
                "resource_id": "27450",
                "resource_type": "Solution",
                "resource_uri": "https://api.access.devgssci.devlab.phx1.redhat.com/rs/solutions/27450",
                "solution_title": " test solution title 1 ",
                "solution_abstract": "test solution abstract 1",
                "solution_url": "https://api.access.devgssci.devlab.phx1.redhat.com/rs/solutions/27450",
                "title": "test title 1",
                "solution_case_count": 3
            };

            this.mockSolutionLinked = {
                'linked': true,
                'pinned_at': false,
                'handPicked':true,
                'last_suggested_date': 1398756612000,
                'lucene_score': 155,
                'resource_id': '637583',
                'resource_type': 'Solution',
                'resource_uri': 'https://api.access.devgssci.devlab.phx1.redhat.com/rs/solutions/637583',
                'solution_title': 'test solution title 2',
                'solution_abstract': 'test solution abstract 2',
                'solution_url': 'https://api.access.devgssci.devlab.phx1.redhat.com/rs/solutions/637583',
                'title': 'test title 2',
                'solution_case_count': 14
            };

            this.mockRecommendations = [{
                "linked": false,
                "pinned_at": true,
                "pinned": true,
                "last_suggested_date": 1398756627000,
                "lucene_score": 141.0,
                "resource_id": "27450",
                "resource_type": "Solution",
                "resource_uri": "https://api.access.devgssci.devlab.phx1.redhat.com/rs/solutions/27450",
                "solution_title": " test solution title 1 ",
                "solution_abstract": "test solution abstract 1",
                "solution_url": "https://api.access.devgssci.devlab.phx1.redhat.com/rs/solutions/27450",
                "title": "test title 1",
                "solution_case_count": 3
            }, {
                "linked": false,
                "pinned_at": false,
                "last_suggested_date": 1398756612000,
                "lucene_score": 155.0,
                "resource_id": "637583",
                "resource_type": "Solution",
                "resource_uri": "https://api.access.devgssci.devlab.phx1.redhat.com/rs/solutions/637583",
                "solution_title": "test solution title 2",
                "solution_abstract": "test solution abstract 2",
                "solution_url": "https://api.access.devgssci.devlab.phx1.redhat.com/rs/solutions/637583",
                "title": "test title 2",
                "solution_case_count": 14
            }];

            this.mockRecommendationsForCase =
            {
                highlighting: {
                    "https://api.access.qa.redhat.com/rs/solutions/275493": {
                        "abstract": [
                            "* Encountering <span class=\"recommendationsKeywords\">Null</span> Pointer in bnx2_poll_work Encountering <span class=\"recommendationsKeywords\">Null</span> Pointer in bnx2_poll_work"
                        ]
                    },
                    "https://api.access.qa.redhat.com/rs/solutions/113993": {
                        "abstract": [
                            "Restarting ssh errored \"/dev/<span class=\"recommendationsKeywords\">null</span> does not exist\". To remake the file run: ~~~ mknod /dev/<span class=\"recommendationsKeywords\">null</span> c 1 3 ~~~ How /dev/<span class=\"recommendationsKeywords\">null</span> goes missing"
                        ]
                    }
                },
                response: {
                    numFound: 6989,
                    start: 0,
                    maxScore: 5.3740954,
                    docs: [
                        {
                            "documentKind": "Solution",
                            "uri": "https://api.access.qa.redhat.com/rs/solutions/275493",
                            "view_uri": "https://access.qa.redhat.com/solutions/275493",
                            "allTitle": "Encountering Null Pointer in bnx2_poll_work",
                            "id": "275493",
                            "abstract": "* Encountering Null Pointer in bnx2_poll_work Encountering Null Pointer in bnx2_poll_work",
                            "score": 5.3740954
                        },
                        {
                            "documentKind": "Solution",
                            "uri": "https://api.access.qa.redhat.com/rs/solutions/113993",
                            "view_uri": "https://access.qa.redhat.com/solutions/113993",
                            "allTitle": "How /dev/null goes missing",
                            "id": "113993",
                            "abstract": "Restarting ssh errored \"/dev/null does not exist\". To remake the file run: ~~~ mknod /dev/null c 1 3 ~~~ How /dev/null goes missing",
                            "score": 4.990787
                        }
                    ]
                }
            };

            this.mockSolution = [{
                "solution_title": 'test solution title 1 ',
                "solution_abstract": 'test solution abstract 1'
            }];

            this.mockSolutions = [{
                "solution_title": 'test solution title 1 ',
                "solution_abstract": 'test solution abstract 1',
                "uri": 'xyz'
            }, {
                "solution_title": 'test solution title 1 ',
                "solution_abstract": 'test solution abstract 1',
                "uri": 'abc'
            }];

            this.mockAccount = [{
                "account_name": 'test_account',
                "account_number": '12345'
            }];

            this.mockAttachment = {
                'file_name': 'abc.txt',
                'uuid': '1234'
            };

            this.mockAttachments = [{
                "filename": "test1.txt",
                "description": "sample1 attachment",
                "attached_by": "testUser",
                "size": "10Mb",
                "checked": true,
                "fullPath": "https://api.access.devgssci.devlab.phx1.redhat.com/attachments/12345"
            }, {
                "filename": "test2.txt",
                "description": "sample2 attachment",
                "attached_by": "testUser",
                "size": "50Mb",
                "checked": true,
                "fullPath": "https://api.access.devgssci.devlab.phx1.redhat.com/attachments/45678"
            }];

            this.mockProducts = [{
                "name": "Red Hat Enterprise Linux",
                "code": "RHEL"
            }];

            this.mockProduct = {
                "name":"Red Hat Enterprise Linux",
                "suggested_artifacts":{
                    "suggested_artifact":[{
                        "name":"sosreport",
                        "description":"Please attach an <a href=\"https://access.redhat.com/knowledge/node/3592\" class=\"help\">sosreport</a> (optional)"
                    }]
                }};

            this.mockSortedProductList = [{
                "name" : "Red Hat Enterprise Linux",
                "code" : "Red Hat Enterprise Linux"
            },{
                "name" : "Red Hat JBoss Enterprise Application Platform",
                "code" : "Red Hat JBoss Enterprise Application Platform"
            },{
                "name" : "Red Hat Satellite or Proxy",
                "code" : "Red Hat Satellite or Proxy"
            },{
                "isDisabled" : true,
                "code" : "────────────────────────────────────────"
            },{
                "name" : "RHEL",
                "code" : "Red Hat Enterprise Linux"
            }];

            this.mockProductList = [{
                "name": "RHEL",
                "code": "Red Hat Enterprise Linux"
            }];
            this.mockVersions = [
                "6.2.3",
                "6.2.4",
                "7.0",
                "6.3.0",
                "6.3.1",
                "6.3.2"
            ];

            this.mockSeverities = [{
                "name": "HIGH",
                "value": "1"
            }, {
                "name": "Medium",
                "value": "2"
            }, {
                "name": "Low",
                "value": "3"
            }];

            this.mockStatuses = [{
                "name": "Closed",
                "value": "closed"
            }, {
                "name": "Open",
                "value": "open"
            }, {
                "name": "Waiting on Red Hat",
                "value": "WORH"
            }];

            this.mockTypes = [{
                "name": "Bug",
                "value": "bug"
            }, {
                "name": "Defect",
                "value": "defect"
            }, {
                "name": "Request",
                "value": "request"
            }];

            this.mockNotifiedUser = {
                "userName": "test@redhat.com",
                "fullName": "test",
                "orgAdmin": true,
                "internal": false
            };
            this.usersOnAccount = [{
                "userName": "test@redhat.com",
                "fullName": "test",
                "org_admin": false,
                "internal": false,
                "access":false,
                "write":false
            }];

            this.mockOriginalNotifiedUsers = [{
                "userName": "test1@redhat.com",
                "fullName": "test1",
                "orgAdmin": true,
                "internal": true
            }, {
                "userName": "test2@redhat.com",
                "fullName": "test2",
                "orgAdmin": false,
                "internal": true
            }];

            this.mockUpdatedNotifiedUsers = [{
                "userName": "test3@redhat.com",
                "fullName": "test3",
                "orgAdmin": false,
                "internal": true
            }, {
                "userName": "test4@redhat.com",
                "fullName": "test4",
                "orgAdmin": false,
                "internal": true
            }];

            this.uri = 'https://test.com/testUser/redhat_access.com';
            this.value = {
                'id': 1234,
                'product': 'rhel',
                'version': '6.0',
                'showDetails': true,
                'showDescription': true,
                'showBugzillas': true,
                'showAttachments': true,
                'showRecommendations': true,
                'showComments': true,
                'showServerSideAttachments': true,
                'showEmailNotifications': true,
                'enableChat': true,
                'isPCM': true,
                'productSortListFile': '/productSortList.txt',
                'chatIframeHackUrlPrefix': 'https://test.cs9.force.com/chatHidden',
                'chatButtonToken': '573A0000000GmiP',
                'chatLiveAgentUrlPrefix': 'https://test.cs9.force.com/chat',
                'chatInitHashOne': '572A0000000GmiP',
                'chatInitHashTwo': '00DK000000W3mDA'
            }

            this.mockModalInstance = {
                result: {
                    then: function (confirmCallback, cancelCallback) {
                        //Store the callbacks for later when the user clicks on the OK or Cancel button of the dialog
                        this.confirmCallBack = confirmCallback;
                        this.cancelCallback = cancelCallback;
                    }
                },
                close: function () {
                    //The user clicked OK on the modal dialog, call the stored confirm callback with the selected item
                    //this.result.confirmCallBack();
                },
                dismiss: function () {
                    //The user clicked cancel on the modal dialog, call the stored cancel callback
                    //this.result.cancelCallback();
                }
            };

            this.mockLocation = {
                path:function (url) {

                },
                url: function () {
                    var url="http://access.qa.redhat.com/support/cases/0123456";
                    return url;
                },

                search: function () {
                    var searchObject={};
                    return searchObject;
                }

            };
            this.mockFilter = function(){
                return "test";

            };

            this.mockSce = {

                trustAsHtml: function (rawHTML) {
                    return rawHTML;
                }

            };

            this.mockModal = {

                open: function () {
                }

            };

            this.mockStatus = {
                open: 'open',
                closed: 'closed',
                both: 'both'
            }

        }
    ])
    .service('strataService', [
        'MockStrataDataService',
        '$q',
        function (MockStrataDataService, $q) {
            this.rejectCall = false;
            this.returnNull=false;
            var that = this;

            return {
                groups: {
                    list: function (ssoUserName) {
                        var deferred = $q.defer();
                        if (that.rejectCall) {
                            deferred.reject();
                        } else {
                            deferred.resolve(MockStrataDataService.mockGroups);
                        }
                        return deferred.promise;
                    },
                    remove: function (groupNumber) {
                        var deferred = $q.defer();
                        if (that.rejectCall) {
                            deferred.reject("strata error");
                        } else {
                            deferred.resolve();
                        }
                        return deferred.promise;
                    },
                    create: function (groupName) {
                        var deferred = $q.defer();
                        if (that.rejectCall) {
                            deferred.reject("strata error");
                        } else {
                            if(that.returnNull)                {

                                deferred.resolve(null);
                            }
                            else{
                                deferred.resolve(MockStrataDataService.mockGroups[0].number);
                            }
                        }
                        return deferred.promise;
                    },
                    get: function (caseNumber,userName) {
                        var deferred = $q.defer();
                        if (that.rejectCall) {
                            deferred.reject("strata error");
                        } else {
                            deferred.resolve(MockStrataDataService.mockGroups[0]);
                        }
                        return deferred.promise;
                    },
                    createDefault: function (groupName) {
                        var deferred = $q.defer();
                        if (that.rejectCall) {
                            deferred.reject("strata error");
                        } else {
                            deferred.resolve("temp group");
                        }
                        return deferred.promise;
                    },
                    update: function (group,userName) {
                        var deferred = $q.defer();
                        if (that.rejectCall) {
                            deferred.reject("strata error");
                        } else {
                            deferred.resolve("updated group");
                        }
                        return deferred.promise;
                    }
                },
                groupUsers: {
                    update: function (userOnAccount,accountNumber,groupNumber) {
                        var deferred = $q.defer();
                        if (that.rejectCall) {
                            deferred.reject("strata error");
                        } else {
                            deferred.resolve("updated group");
                        }
                        return deferred.promise;
                    }
                },
                accounts: {
                    users: function (accountNumber) {
                        var deferred = $q.defer();
                        if (that.rejectCall) {
                            deferred.reject();
                        } else {
                            deferred.resolve(MockStrataDataService.mockUsers);
                        }
                        return deferred.promise;
                    },
                    list: function () {
                        var deferred = $q.defer();
                        if (that.rejectCall) {
                            deferred.reject("strata error");
                        } else {
                            deferred.resolve(MockStrataDataService.mockAccount[0].account_number);
                        }
                        return deferred.promise;
                    },
                    get: function (accountNumber) {
                        var deferred = $q.defer();
                        if (that.rejectCall) {
                            deferred.reject();
                        } else {
                            deferred.resolve(MockStrataDataService.mockAccount[0]);
                        }
                        return deferred.promise;
                    }
                },
                cases: {
                    externalUpdates:{
                        list:function(id){
                            var deferred = $q.defer();
                            if (that.rejectCall) {
                                deferred.reject();
                            } else {
                                deferred.resolve(MockStrataDataService.mockExternalUpdates);
                            }
                            return deferred.promise;
                        }
                    },
                    comments: {
                        get: function (id) {
                            var deferred = $q.defer();
                            if (that.rejectCall) {
                                deferred.reject();
                            } else {
                                deferred.resolve(MockStrataDataService.mockComments);
                            }
                            return deferred.promise;
                        },
                        post: function (caseNumber, commentText) {
                            var deferred = $q.defer();
                            if (that.rejectCall) {
                                deferred.reject();
                            } else {
                                deferred.resolve(MockStrataDataService.mockComments[0].id);
                            }
                            return deferred.promise;
                        },
                        put: function (caseNumber, commentText, id) {
                            var deferred = $q.defer();
                            if (that.rejectCall) {
                                deferred.reject();
                            } else {
                                deferred.resolve(MockStrataDataService.mockComments[0].id);
                            }
                            return deferred.promise;
                        }
                    },
                    get: function (caseNumber) {
                        var deferred = $q.defer();
                        if (that.rejectCall) {
                            deferred.reject("strata error");
                        } else {
                            deferred.resolve(MockStrataDataService.mockCases[0]);
                        }
                        return deferred.promise;
                    },
                    post: function (caseJSON) {
                        var deferred = $q.defer();
                        if (that.rejectCall) {
                            deferred.reject();
                        } else {
                            deferred.resolve(12345);
                        }
                        return deferred.promise;
                    },
                    filter: function (params) {
                        var deferred = $q.defer();
                        if (that.rejectCall) {
                            var error = {
                                xhr: {
                                    status: 401
                                }
                            };
                            deferred.reject(error);
                        } else {
                            deferred.resolve(MockStrataDataService.mockFilterCase);
                        }
                        return deferred.promise;
                    },
                    search: function (caseStatus, caseOwner, caseGroup, searchString, sortField, sortOrder, offset, limit, queryParams, addlQueryParams) {
                        var deferred = $q.defer();
                        if (that.rejectCall) {
                            deferred.reject(error);
                        } else {
                            deferred.resolve(MockStrataDataService.mockFilterCase);
                        }
                        return deferred.promise;
                    },
                    attachments: {
                        post: function (id, caseNumber) {
                            var deferred = $q.defer();
                            if (that.rejectCall) {
                                deferred.reject();
                            } else {
                                deferred.resolve(MockStrataDataService.uri);
                            }
                            return deferred.promise;
                        },
                        remove: function (id, caseNumber) {
                            var deferred = $q.defer();
                            if (that.rejectCall) {
                                deferred.reject();
                            } else {
                                deferred.resolve();
                            }
                            return deferred.promise;
                        },
                        list: function (caseNumber) {
                            var deferred = $q.defer();
                            if (that.rejectCall) {
                                deferred.reject("strata error");
                            } else {
                                deferred.resolve(MockStrataDataService.mockAttachments);
                            }
                            return deferred.promise;
                        }
                    },
                    put: function (id, caseObj) {
                        var deferred = $q.defer();
                        if (that.rejectCall) {
                            deferred.reject();
                        } else {
                            deferred.resolve();
                        }
                        return deferred.promise;
                    },
                    notified_users: {
                        remove: function (caseNumber, user) {
                            var deferred = $q.defer();
                            if (that.rejectCall) {
                                deferred.reject();
                            } else {
                                deferred.resolve();
                            }
                            return deferred.promise;
                        },
                        add: function (caseNumber, user) {
                            var deferred = $q.defer();
                            if (that.rejectCall) {
                                deferred.reject();
                            } else {
                                deferred.resolve();
                            }
                            return deferred.promise;
                        }
                    },
                    csv: function () {
                        var deferred = $q.defer();
                        if (that.rejectCall) {
                            deferred.reject("strata error");
                        } else {
                            deferred.resolve(MockStrataDataService.mockCases);
                        }
                        return deferred.promise;
                    },
                    owner: {
                        update: function () {
                            var deferred = $q.defer();
                            if (that.rejectCall) {
                                deferred.reject("strata error");
                            } else {
                                deferred.resolve();
                            }
                            return deferred.promise;
                        }
                    }
                },
                cache: {
                    clr: function () {
                        var deferred = $q.defer();
                        if (that.rejectCall) {
                            deferred.reject();
                        } else {
                            deferred.resolve();
                        }
                        return deferred.promise;
                    }
                },
                entitlements: {
                    get: function (showAll, ssoUserName) {
                        var deferred = $q.defer();
                        if (that.rejectCall) {
                            deferred.reject();
                        } else {
                            deferred.resolve(MockStrataDataService.mockEntitlements);
                        }
                        return deferred.promise;
                    }
                },
                solutions: {
                    get: function (showAll, ssoUserName) {
                        var deferred = $q.defer();
                        if (that.rejectCall) {
                            deferred.reject();
                        } else {
                            deferred.resolve(MockStrataDataService.mockSolution);
                        }
                        return deferred.promise;
                    }
                },
                problems: function (params, max) {
                    var deferred = $q.defer();
                    if (that.rejectCall) {
                        deferred.reject();
                    } else {
                        deferred.resolve(MockStrataDataService.mockSolutions);
                    }
                    return deferred.promise;
                },
                recommendations: function (params, max) {
                    var deferred = $q.defer();
                    if (that.rejectCall) {
                        deferred.reject();
                    } else {
                        deferred.resolve(MockStrataDataService.mockRecommendations);
                    }
                    return deferred.promise;
                },
                recommendationsXmlHack: function (params, max,highlight, highlightTags) {
                    var deferred = $q.defer();
                    if (that.rejectCall) {
                        deferred.reject();
                    } else {
                        deferred.resolve(MockStrataDataService.mockRecommendations);
                    }
                    return deferred.promise;
                },
                recommendationsForCase: function (data, limit, start, highlight, highlightTagPre, highlightTagPost) {
                    var deferred = $q.defer();
                    if (that.rejectCall) {
                        deferred.reject();
                    } else {
                        deferred.resolve(MockStrataDataService.mockRecommendationsForCase);
                    }
                    return deferred.promise;
                },
                products: {
                    list: function () {
                        var deferred = $q.defer();
                        if (that.rejectCall) {
                            deferred.reject();
                        } else {
                            deferred.resolve(MockStrataDataService.mockProducts);
                        }
                        return deferred.promise;
                    },
                    versions: function (productCode) {
                        var deferred = $q.defer();
                        if (that.rejectCall) {
                            deferred.reject("strata error");
                        } else {
                            deferred.resolve(MockStrataDataService.mockVersions);
                        }
                        return deferred.promise;
                    },
                    get: function (productCode) {
                        var deferred = $q.defer();
                        if (that.rejectCall) {
                            deferred.reject("strata error");
                        } else {
                            deferred.resolve(MockStrataDataService.mockProduct);
                        }
                        return deferred.promise;
                    }
                },
                values: {
                    cases: {
                        severity: function () {
                            var deferred = $q.defer();
                            if (that.rejectCall) {
                                deferred.reject();
                            } else {
                                deferred.resolve(MockStrataDataService.mockSeverities);
                            }
                            return deferred.promise;
                        },
                        types: function () {
                            var deferred = $q.defer();
                            if (that.rejectCall) {
                                deferred.reject();
                            } else {
                                deferred.resolve(MockStrataDataService.mockTypes);
                            }
                            return deferred.promise;
                        },
                        attachment: {
                            size: function () {
                                var deferred = $q.defer();
                                if (that.rejectCall) {
                                    deferred.reject();
                                } else {
                                    deferred.resolve(MockStrataDataService.mockFileSize);
                                }
                                return deferred.promise;
                            }
                        },
                        status: function () {
                            var deferred = $q.defer();
                            if (that.rejectCall) {
                                deferred.reject();
                            } else {
                                deferred.resolve(MockStrataDataService.mockStatuses);
                            }
                            return deferred.promise;
                        }
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
    ])
    .service('MockCaseService', [
        'MockStrataDataService',
        '$q',
        function (MockStrataDataService, $q) {

            this.caseDataReady = false;
            this.kase = {};
            this.versions = [];
            this.products = [];
            this.severities = [];
            this.groups = [];
            this.users = [];
            this.comments = [];
            this.externalUpdates=[];
            this.filterSelect = '';

            this.localStorageCache=[];
            this.localStorageCache.remove=function(key)
            {


            };

            this.localStorageCache.put=function(key,val)
            {


            };
            this.originalNotifiedUsers = [];
            this.updatedNotifiedUsers = [];

            this.account = {};

            this.draftComment = {};
            this.commentText = '';
            this.status = '';
            this.severity = '';
            this.type = '';
            this.group = '';
            this.owner = '';
            this.product = '';
            this.bugzillaList = {};

            //this.refreshComments = function () {};
            this.commentsOnScreen = [];
            this.commentsPerPage = 4;
            this.selectCommentsPage = function(pageNum) {};

            this.setSeverities = function(severities) {
                this.severities = severities;
            };

            this.populateUsers =  function () {
                var deferred = $q.defer();
                deferred.resolve(MockStrataDataService.mockUsers);
                return deferred.promise;

            };
            this.validateNewCase = function(){
            };
            this.clearProdVersionFromLS = function(){
            };

            this.onSelectChanged =  function () {

            };

            this.clearCase = function () {
                this.kase = {};
                this.caseDataReady = false;
            };
            this.validateNewCasePage1 = function () {};

            this.populateComments = function (caseNumber) {
                var deferred = $q.defer();
                deferred.resolve(MockStrataDataService.mockComments);
                return deferred.promise;
            };

            this.populateExternalUpdates = function (caseNumber) {
                var deferred = $q.defer();
                deferred.resolve(MockStrataDataService.mockExternalUpdates);
                return deferred.promise;
            };

            this.defineCase = function (rawCase) {
                this.kase = rawCase;
                this.caseDataReady = false;
            };
            this.resetCase = function (rawCase) {

            };
            this.setCase = function (jsonCase) {
                this.
                    kase = jsonCase;
                this.caseDataReady = true;

            };

            this.defineAccount = function (account) {
                this.account = account;
            };

            this.defineNotifiedUsers = function () {
                this.updatedNotifiedUsers.push(MockStrataDataService.mockUsers.sso_username);
            };

            this.populateGroups = function (ssoUsername) {
                var deferred = $q.defer();
                this.groupsLoading = true;
                this.groups = MockStrataDataService.mockGroups;
                deferred.resolve(MockStrataDataService.mockGroups);
                return deferred.promise;
            };

            this.populateEntitlements = function (ssoUserName) {
                this.entitlements = MockStrataDataService.mockEntitlements;
            };

            this.checkForCaseStatusToggleOnAttachOrComment=function(){
                var status = { name: 'Waiting on Red Hat' };
                this.kase.status = status;

            };

            this.updateCase=function(){
                var deferred = $q.defer();
                this.updatingCase=false;
                deferred.resolve();
                return deferred.promise;
            };


            this.buildGroupOptions = function() {
                this.kase.group = MockStrataDataService.mockGroups[1]
            }
        }
    ])
    .service('MockRecommendationsService', [
        'MockStrataDataService',
        '$q',
        function (MockStrataDataService, $q) {
            this.recommendations = [];
            this.pinnedRecommendations = [];
            this.handPickedRecommendations = [];

            this.pageSize = 4;
            this.maxSize = 10;
            this.recommendationsOnScreen = [];
            this.selectPage = function (pageNum) {};

            var currentData = {};
            this.loadingRecommendations = false;
            this.clear = function () {
                this.recommendations = [];
            };
            this.populateRecommendations = function (max) {
                this.recommendations = MockStrataDataService.mockSolutions;
                var deferred = $q.defer();
                deferred.resolve(MockStrataDataService.mockSolutions);
                return deferred.promise;
            };
            this.populatePCMRecommendations = function (max) {
                this.recommendations = MockStrataDataService.mockSolutions;
                var deferred = $q.defer();
                deferred.resolve(MockStrataDataService.mockSolutions);
                return deferred.promise;
            };
            this.populatePCMRecommendationsForEdit = function (max) {
                this.recommendations = MockStrataDataService.mockSolutions;
                var deferred = $q.defer();
                deferred.resolve(MockStrataDataService.mockSolutions);
                return deferred.promise;
            };
            this.populatePinnedRecommendations = function () {
                this.pinnedRecommendations.push(MockStrataDataService.mockSolutions[0]);
                var deferred = $q.defer();
                deferred.resolve(MockStrataDataService.mockSolutions);
                return deferred.promise;
            };
            this.setPopulateCallback = function (callback) {
                this.populateCallback = callback;
            };
            this.getRecommendations = function (refreshRecommendations) {
                this.loadingRecommendations = false;
                this.recommendations= MockStrataDataService.mockSolutions;
            };
        }
    ])
    .service('MockHeaderService', [
        'MockStrataDataService',
        '$q',
        function (MockStrataDataService, $q) {
            this.pageLoadFailure=true;
        }
    ])
    .service('MockProductsService', [
        'MockStrataDataService',
        '$q',
        function (MockStrataDataService, $q) {

            this.products = [];
            this.productsDisabled = false;
            this.productsLoading = false;
            this.versions = [];
            this.versionDisabled = false;
            this.versionLoading = false;
            this.clear = function(){
                this.products = [];
                this.versions = [];
            };
            this.getProducts = function (fetchForContact) {
                var deferred = $q.defer();
                deferred.resolve(MockStrataDataService.mockProducts);
                return deferred.promise;
            };

            this.getVersions = function (fetchForContact) {
                var deferred = $q.defer();
                deferred.resolve(MockStrataDataService.mockVersions);
                return deferred.promise;
            };
        }
    ])
    .service('MockDiscussionService', [
        'MockStrataDataService',
        '$q',
        function (MockStrataDataService, $q) {

            this.commentTextBoxEnlargen =false;
            this.updateElements=function()
            {


            }

        }
    ])

    .service('MockRHAUtils', [
        'MockStrataDataService',
        '$q',
        function (MockStrataDataService, $q) {

            this.userTimeZone="Asia/Calcutta";
            this.convertToTimezone=function(date)
            {
                var timezoneDate=window.moment(date).tz(this.userTimeZone);
                return timezoneDate;
            };

            this.formatDate=function(date,formatter)
            {
                return date.format(formatter);
            };

        }
    ])
    .service('MockSearchResultsService', [
        'MockStrataDataService',
        '$q',
        function (MockStrataDataService, $q) {
            this.searchInProgress = {
                value: false
            };
            this.results = [];
            this.clear = function () {
                this.results.length = 0;
            };
            this.add = function (result) {
                this.results.push(result);
            };
        }
    ])
    .service('MockAttachmentsService', [
        'MockStrataDataService',
        '$q',
        function (MockStrataDataService, $q) {
            this.originalAttachments = [];
            this.updatedAttachments = [];
            this.backendAttachments = [];
            this.maxAttachmentSize=0;
            this.removeUpdatedAttachment = function ($index) {
                this.updatedAttachments.splice($index, 1);
            };
            this.defineOriginalAttachments = function (attachments) {
                if (!angular.isArray(attachments)) {
                    this.originalAttachments = [];
                } else {
                    this.originalAttachments = attachments;
                }
            };
            this.addNewAttachment = function (attachment) {
                this.updatedAttachments.push(attachment);
            };
            this.updateAttachments = function (caseId) {
                this.updatedAttachments.push(MockStrataDataService.mockAttachments[0]);
                var deferred = $q.defer();
                deferred.resolve();
                return deferred.promise;
            };
            this.clear = function () {
                this.originalAttachments = [];
                this.updatedAttachments = [];
                this.backendAttachments = [];
            };
            this.hasBackEndSelections = function () {
                return true;
            };
            this.updateBackEndAttachments = function (selected) {
                this.backendAttachments = selected;
            };
            this.fetchMaxAttachmentSize = function () {
                this.maxAttachmentSize =  45;
            };
        }
    ])
    .service('MockGroupService', [
        'MockStrataDataService',
        '$q',
        function (MockStrataDataService, $q) {
            this.reloadTable = function () {};
            this.reloadTableAndClearPagination=function(){};
            this.groupsOnScreen = [];
        }
    ])
    .service('MockAlertService', [
        'MockStrataDataService',
        '$q',
        function (MockStrataDataService, $q) {
            this.alerts = [];
            this.clearAlerts = function () {
                this.alerts = [];
            };
            this.addSuccessMessage = function (message) {
                return this.addMessage(message, 'success');
            };
            this.addWarningMessage = function (message) {
                return this.addMessage(message, 'warning');
            };
            this.addStrataErrorMessage = function (error) {
                return this.addMessage(error, 'danger');
            };
            this.addDangerMessage = function (error) {
                return this.addMessage(error, 'danger');
            };
            this.addMessage = function (message, type) {
                var alert = {
                    message: message,
                    type: type === null ? 'warning' : type
                };
                this.addAlert(alert);
                return alert;
            };
            this.addAlert = function (alert) {
                this.alerts.push(alert);
            };
            this.removeAlert = function (alert) {
                this.alerts.splice(this.alerts.indexOf(alert), 1);
            };
        }
    ])
    .service('MockSearchBoxService', [
        'MockStrataDataService',
        '$q',
        function (MockStrataDataService, $q) {
            this.doSearch = function () {};
            this.searchTerm = function () {};
            this.onKeyPress = function () {};
        }
    ])
    .service('MockSearchCaseService', [
        'MockStrataDataService',
        '$q',
        function (MockStrataDataService, $q) {
            this.cases = MockStrataDataService.mockCases;
            this.searching = false;
            this.caseParameters = {
                searchTerm: '',
                status: "open",
                group: ''
            };
            this.prefilter;
            this.postfilter;
            this.start = 0;
            this.count = 100;
            this.total = 0;
            this.allCasesDownloaded = false;
            this.doFilter = function () {
                var deferred = $q.defer();
                deferred.resolve();
                return deferred.promise;
            };
            this.clearPagination = function () {
                this.start = 0;
                this.total = 0;
                this.allCasesDownloaded = false;
                this.cases = [];
            };
            this.clear = function () {
                this.cases = [];
                this.oldParams = {};
                this.start = 0;
                this.total = 0;
                this.allCasesDownloaded = false;
            };
        }
    ])
    .service('MockTreeViewSelectorData', [
        'MockStrataDataService',
        '$q',
        function (MockStrataDataService, $q) {

            this.getTree = function (dataUrl, sessionId) {
                var defer = $q.defer();
                var tree = MockStrataDataService.mockAttachments;
                defer.resolve(tree);
                return defer.promise;
            };
        }
    ])
    .service('TreeViewSelectorUtils', [
        'MockStrataDataService',
        '$q',
        function (MockStrataDataService, $q) {

            this.hasSelections = function (tree) {
                return hasSelectedLeaves(tree);
            };
            var hasSelectedLeaves = function (tree) {
                return true;
            };
            var getSelectedNames = function (tree, container) {
                for (var i = 0; i < tree.length; i++) {
                    if (tree[i] !== undefined) {
                        if (tree[i].checked === true) {
                            container.push(tree[i].fullPath);
                        }
                    }
                }
            };
            this.getSelectedLeaves = function (tree) {
                if (tree === undefined) {
                    return [];
                }
                var container = [];
                getSelectedNames(tree, container);
                return container;
            };
        }
    ])
;
