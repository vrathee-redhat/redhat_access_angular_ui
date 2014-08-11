'use strict';

angular.module('RedhatAccess.mock', [])
  .service('MockStrataDataService', [
    function () {
      this.mockGroups = [{
        "number": "80437",
        "name": "sfWdBWa6La",
        "is_private": false,
        "is_default": false
      }, {
        "number": "49496",
        "name": "groupTest:1398506570363",
        "is_private": false,
        "is_default": false
      }];
 
      this.mockUsers = [{
        "title": "Denises Hughes",
        "type": "application/vnd.redhat.user",
        "sso_username": "dhughesgit"
      }, {
        "title": "Customer Portal-Qa",
        "type": "application/vnd.redhat.user",
        "sso_username": "customerportalQA"
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
 
      this.mockCases = [{
        "created_by": "Sunil Keshari",
        "created_date": 1405416971000,
        "last_modified_by": "Sunil Keshari",
        "last_modified_date": 1405416972000,
        "id": "500K0000006FeAaIAK",
        "uri": "https://api.access.devgssci.devlab.phx1.redhat.com/rs/cases/01364190",
        "summary": "test case notified users",
        "description": "test",
        "status": "Waiting on Red Hat",
        "product": "Red Hat Enterprise Linux",
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
        "closed": false
      }, {
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
        "closed": false
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
        "closed": false
      }];
 
      this.mockEntitlements = [];
 
      this.mockRecommendations = [{
        "linked": false,
        "pinned_at": true,
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
        "solution_case_count": 14,
      }];

      this.mockSolution = [{
        "solution_title": 'test solution title 1 ',
        "solution_abstract": 'test solution abstract 1'
      }];

      this.mockSolutions = [{
        "solution_title": 'test solution title 1 ',
        "solution_abstract": 'test solution abstract 1',
        "uri": 'xyz'
      },{
        "solution_title": 'test solution title 1 ',
        "solution_abstract": 'test solution abstract 1',
        "uri": 'abc'
      }];

      this.mockAccount = [{
        "account_name": 'test_account',
        "account_number": '12345'
      }];

      this.mockAttachments = [{
        "filename": "test1.txt",
        "description": "sample1 attachment",
        "attached_by": "testUser",
        "size": "10Mb"
      }, {
        "filename": "test2.txt",
        "description": "sample2 attachment",
        "attached_by": "testUser",
        "size": "50Mb"
      }];

      this.mockVersions = [{
          "name": "6.0",
          "value": "6.0"
      }];

      this.uri = 'https://test.com/testUser/redhat_access.com';
      this.value = {
        'product': 'rhel',
        'version': '6.0'
      }
 
    }
  ])
.service('strataService', [
  'MockStrataDataService',
  '$q',
  function (MockStrataDataService,$q) {
    this.rejectCall = false;
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
        }
      },
      cases: {
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
          post: function (caseNumber,commentText) {
            var deferred = $q.defer();
            if (that.rejectCall) {
              deferred.reject();
            } else {
              deferred.resolve(MockStrataDataService.mockComments[0].id);
            }
            return deferred.promise;
          },
          put: function (caseNumber,commentText,id) {
            var deferred = $q.defer();
            if (that.rejectCall) {
              deferred.reject();
            } else {
              deferred.resolve(MockStrataDataService.mockComments[0].id);
            }
            return deferred.promise;
          }
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
            deferred.reject();
          } else {
            deferred.resolve(MockStrataDataService.mockCases);
          }
          return deferred.promise;
        },
        attachments: {
          post: function (id,caseNumber) {
             var deferred = $q.defer();
            if (that.rejectCall) {
              deferred.reject();
            } else {
              deferred.resolve(MockStrataDataService.uri);
            }
           return deferred.promise;
          },
          remove: function (id,caseNumber) {
             var deferred = $q.defer();
             if (that.rejectCall) {
               deferred.reject();
             } else {
               deferred.resolve();
             }
            return deferred.promise;
          }
        },
        put : function(id,caseObj) {
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
      problems: function (params,max) {
        var deferred = $q.defer();
        if (that.rejectCall) {
          deferred.reject();
        } else {
          deferred.resolve(MockStrataDataService.mockSolutions);
        }
        return deferred.promise;
      },
      products: {
        list: function() {
          var deferred = $q.defer();
          if (that.rejectCall) {
            deferred.reject();
          } else {
            deferred.resolve(MockStrataDataService.mockSolutions);
          }
          return deferred.promise;
        },
        versions: function(productCode) {
          var deferred = $q.defer();
          if (that.rejectCall) {
            deferred.reject();
          } else {
            deferred.resolve(MockStrataDataService.mockVersions);
          }
          return deferred.promise;
        }
      },
      rejectCalls: function () {
        that.rejectCall = true;
      }
    };
  }
])
.service('MockCaseService', [
  'MockStrataDataService',
  '$q',
  function (MockStrataDataService,$q) {

    this.kase = {};
    this.versions = [];
    this.products = [];
    
    this.severities = [];
    this.groups = [];
    this.users = [];
    this.comments = [];

    this.originalNotifiedUsers = [];
    this.updatedNotifiedUsers = [];

    this.account = {};

    this.draftComment = '';
    this.commentText = '';
    this.status = '';
    this.severity = '';
    this.type = '';
    this.group = '';
    this.owner = '';
    this.product = '';
    this.bugzillaList = {};

    this.refreshComments = function() {};
    this.clearCase = function() {
      this.kase = {};
    };
    this.validateNewCasePage1 = function () {};


    this.populateComments = function(caseNumber) {
        var deferred = $q.defer();
        deferred.resolve(MockStrataDataService.mockComments);          
        return deferred.promise;
    };
  }
])
.service('MockRecommendationsService', [
  'MockStrataDataService',
  '$q',
  function (MockStrataDataService,$q) {
    this.recommendations = [];
    this.pinnedRecommendations = [];
    this.handPickedRecommendations = [];
    this.populateCallback = function() {};

    var currentData = {};
    this.loadingRecommendations = false;
    this.clear = function() {
      this.recommendations = [];
    };
    this.populateRecommendations = function (max) {
        this.recommendations = MockStrataDataService.mockSolutions;
        var deferred = $q.defer();
        deferred.resolve(MockStrataDataService.mockSolutions);          
        return deferred.promise;
    };
  }
])
.service('MockSearchResultsService', [
  'MockStrataDataService',
  '$q',
  function (MockStrataDataService,$q) {
    this.searchInProgress = {
          value: false
    };
    this.results = [];
    this.clear = function() {
      this.results.length = 0;
    };
    this.add = function(result) {
      this.results.push(result);
    };
  }
]);