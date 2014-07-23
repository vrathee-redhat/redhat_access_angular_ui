'use strict';

describe('Case Services', function() {

	var caseService;
	var strataService;
	var securityService;
	var q;

	beforeEach(angular.mock.module('RedhatAccess.cases'));
	beforeEach(inject(function (_CaseService_,$injector,$q) {
	    caseService = _CaseService_;
	    strataService = $injector.get('strataService');
	    securityService = $injector.get('securityService');
	    q = $q;
	}));

	it('should have a method for populating Case Groups', function () {
		expect(caseService.populateGroups).toBeDefined();  
		var ssoUsername = 'testUser';
		var deferred = q.defer();
		spyOn(strataService.groups, 'list').andReturn(deferred.promise);
		deferred.resolve();  
		caseService.populateGroups(ssoUsername);
		expect(strataService.groups.list).toHaveBeenCalledWith(ssoUsername);
  	});

  	it('should have a method for populating Case Comments', function () {
		expect(caseService.populateComments).toBeDefined();  
		var caseNumber = '12345';
		var deferred = q.defer();
		spyOn(strataService.cases.comments, 'get').andReturn(deferred.promise);
		deferred.resolve();  
		caseService.populateComments(caseNumber);
		expect(strataService.cases.comments.get).toHaveBeenCalledWith(caseNumber);
		expect(caseService.comments).not.toBe(null);
  	});

  	it('should have a method for populating User Entitlements', function () {
		expect(caseService.populateEntitlements).toBeDefined();  
		var ssoUsername = 'testUser';
		var deferred = q.defer();
		spyOn(strataService.entitlements, 'get').andReturn(deferred.promise);
		deferred.resolve();  
		caseService.populateEntitlements(ssoUsername);
		expect(strataService.entitlements.get).toHaveBeenCalledWith(false,ssoUsername);	
		expect(caseService.entitlements).not.toBe(null);	
  	});

  	it('should have a method for validating New Case Page', function () {
		expect(caseService.validateNewCasePage1).toBeDefined(); 
		expect(caseService.newCasePage1Incomplete).toBe(true);
		caseService.kase.product = '';
        caseService.kase.version = '';
        caseService.kase.summary = '';
        caseService.kase.description = '';		 
		caseService.validateNewCasePage1();
		expect(caseService.newCasePage1Incomplete).toBe(true);
		caseService.kase.product = 'Red Hat Enterprise Linux';
        caseService.kase.version = '6.0';
        caseService.kase.summary = 'Tset Summary';
        caseService.kase.description = 'Test Description';		 
		caseService.validateNewCasePage1();
		expect(caseService.newCasePage1Incomplete).toBe(false);			
  	});

  	it('should have a method to Show/Hide the FTS flag', function () {
		expect(caseService.showFts).toBeDefined();
		var fts = false;
		caseService.severities = [{"name":"1 (Urgent)"},{"name":"2 (High)"},{"name":"3 (Normal)"},{"name":"4 (Low)"}];
		// Show the FTS flag for sev 1 premium case
		caseService.kase.severity = {"name":"1 (Urgent)"};
		caseService.kase.entitlement = {};  
		caseService.kase.entitlement.sla = 'PREMIUM'
		fts = caseService.showFts();
		expect(fts).toBe(true);
		// Hide the FTS flag for non premium case
		caseService.kase.entitlement.sla = 'STANDARD'	
		fts = caseService.showFts();
		expect(fts).toBe(false);
		// Hide the FTS flag for premium but non sev1 case
		caseService.kase.severity = {"name":"3 (Normal)"};
		caseService.kase.entitlement = {};  
		caseService.kase.entitlement.sla = 'PREMIUM'
		fts = caseService.showFts();
		expect(fts).toBe(false);
  	});

  	it('should have a method for populating Users For An Account', function () {
		expect(caseService.populateUsers).toBeDefined(); 
		securityService.loginStatus.orgAdmin = true; 
		caseService.account.number = '540155';
		var deferred = q.defer();
		spyOn(strataService.accounts, 'users').andReturn(deferred.promise);
		deferred.resolve();  
		caseService.populateUsers();
		expect(strataService.accounts.users).toHaveBeenCalledWith('540155');
		expect(caseService.users).not.toBe(null);
  	});

  	it('should have a method for defining Notified Users for a case', function () {
		expect(caseService.defineNotifiedUsers).toBeDefined(); 
		caseService.kase.contact_sso_username = 'testUser';	
		caseService.kase.notified_users	= {"link":[
		{"title":"Denises Hughes","type":"application/vnd.redhat.user","sso_username":"dhughesgit"},
		{"title":"Customer Portal-Qa","type":"application/vnd.redhat.user","sso_username":"customerportalQA"}]}
		caseService.defineNotifiedUsers();
		expect(caseService.updatedNotifiedUsers).toContain('testUser','dhughesgit','customerportalQA');
  	});

});