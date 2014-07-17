'use strict';

angular.module('RedhatAccess.cases')
  .service('MockService', [
    'strataService',
    'AlertService',
    'ENTITLEMENTS',
    'RHAUtils',
    'securityService',
    '$q',
    '$filter',
    function(strataService, AlertService, ENTITLEMENTS, RHAUtils, securityService, $q, $filter) { 

      var mockGroups = [
        {"number":"80437","name":"sfWdBWa6La","is_private":false,"is_default":false},
        {"number":"49496","name":"groupTest:1398506570363","is_private":false,"is_default":false}
        ];  

      var mockUsers = [
        {"title":"Denises Hughes","type":"application/vnd.redhat.user","sso_username":"dhughesgit"},
        {"title":"Customer Portal-Qa","type":"application/vnd.redhat.user","sso_username":"customerportalQA"}
        ];  

      var mockComments = [
        {"created_by":"Robinson, David","created_date":1205811351000,"text":"comment1","draft":false},
        {"created_by":"Napolis, Michael","created_date":1205370090000,"text":"comment2","draft":true}
        ];

      var mockCases = [
        {"created_by":"Sunil Keshari","created_date":1405416971000,"last_modified_by":"Sunil Keshari","last_modified_date":1405416972000,"id":"500K0000006FeAaIAK","uri":"https://api.access.devgssci.devlab.phx1.redhat.com/rs/cases/01364190","summary":"test case notified users","description":"test","status":"Waiting on Red Hat","product":"Red Hat Enterprise Linux","version":"7.0","account_number":"940527","escalated":false,"contact_name":"Sunil Keshari","contact_sso_username":"skesharigit","origin":"Web","owner":"New Case Queue","severity":"4 (Low)","comments":{},"notified_users":{},"entitlement":{"sla":"UNKNOWN"},"fts":false,"bugzillas":{},"sbr_groups":{},"case_number":"01364190","closed":false},
        {"created_by":"Sunil Keshari","created_date":1405340814000,"last_modified_by":"Sunil Keshari","last_modified_date":1405340815000,"id":"500K0000006FMC3IAO","uri":"https://api.access.devgssci.devlab.phx1.redhat.com/rs/cases/01359975","summary":"another test case","description":"test test","status":"Waiting on Red Hat","product":"JBoss Web Framework Kit","version":"1.1.0","account_number":"940527","escalated":false,"contact_name":"Sunil Keshari","contact_sso_username":"skesharigit","origin":"API","owner":"New Case Queue","severity":"4 (Low)","comments":{},"notified_users":{},"entitlement":{"sla":"UNKNOWN"},"fts":false,"bugzillas":{},"sbr_groups":{},"case_number":"01359975","closed":false},
        {"created_by":"Sunil Keshari","created_date":1405340608000,"last_modified_by":"Sunil Keshari","last_modified_date":1405340613000,"id":"500K0000006FM7dIAG","uri":"https://api.access.devgssci.devlab.phx1.redhat.com/rs/cases/01359974","summary":"test case","description":"test case","status":"Waiting on Red Hat","product":"Red Hat Enterprise Linux","version":"6.0","account_number":"940527","escalated":false,"contact_name":"Sunil Keshari","contact_sso_username":"skesharigit","origin":"API","owner":"New Case Queue","severity":"4 (Low)","comments":{},"notified_users":{},"entitlement":{"sla":"UNKNOWN"},"fts":false,"bugzillas":{},"sbr_groups":{},"case_number":"01359974","closed":false}
      ];

      var mockEntitlements = [];
           
    }
  ]);
