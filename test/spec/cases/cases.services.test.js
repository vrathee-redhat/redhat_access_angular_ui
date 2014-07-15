//'use strict';

describe('Case Services', function() {

	var caseService;
	var searchCaseService;
	var strataService;
	var securityService;
	var mockSCope;
	var q;

	beforeEach(angular.mock.module('RedhatAccess.cases'));
	beforeEach(angular.mock.inject(function($rootScope) {
        mockScope = $rootScope.$new();
    }));
	beforeEach(inject(function (_CaseService_,_SearchCaseService_,$injector,$q) {
	    caseService = _CaseService_;
	    searchCaseService = _SearchCaseService_
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
		caseService.case.product = '';
        caseService.case.version = '';
        caseService.case.summary = '';
        caseService.case.description = '';		 
		caseService.validateNewCasePage1();
		expect(caseService.newCasePage1Incomplete).toBe(true);
		caseService.case.product = 'Red Hat Enterprise Linux';
        caseService.case.version = '6.0';
        caseService.case.summary = 'Tset Summary';
        caseService.case.description = 'Test Description';		 
		caseService.validateNewCasePage1();
		expect(caseService.newCasePage1Incomplete).toBe(false);			
  	});

  	it('should have a method to Show/Hide the FTS flag', function () {
		expect(caseService.showFts).toBeDefined();
		var fts = false;
		caseService.severities = [{"name":"1 (Urgent)"},{"name":"2 (High)"},{"name":"3 (Normal)"},{"name":"4 (Low)"}];
		// Show the FTS flag for sev 1 premium case
		caseService.case.severity = {"name":"1 (Urgent)"};
		caseService.case.entitlement = {};  
		caseService.case.entitlement.sla = 'PREMIUM'
		fts = caseService.showFts();
		expect(fts).toBe(true);
		// Hide the FTS flag for non premium case
		caseService.case.entitlement.sla = 'STANDARD'	
		fts = caseService.showFts();
		expect(fts).toBe(false);
		// Hide the FTS flag for premium but non sev1 case
		caseService.case.severity = {"name":"3 (Normal)"};
		caseService.case.entitlement = {};  
		caseService.case.entitlement.sla = 'PREMIUM'
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
		caseService.case.contact_sso_username = 'testUser';	
		caseService.case.notified_users	= {"link":[
		{"title":"Denises Hughes","type":"application/vnd.redhat.user","sso_username":"dhughesgit"},
		{"title":"Customer Portal-Qa","type":"application/vnd.redhat.user","sso_username":"customerportalQA"}]}
		caseService.defineNotifiedUsers();
		expect(caseService.updatedNotifiedUsers).toContain('testUser','dhughesgit','customerportalQA');
  	});

  	it('should have a method to Filter/Search cases', function () {
		expect(searchCaseService.doFilter).toBeDefined(); 
		searchCaseService.oldParams = {};			
      	securityService.loginStatus.login = 'testUser';

      	var filterParams = {
	        include_closed: true,
	        count: 100,
	        product: 'Red Hat Enterprise Linux',
	        owner: '',
	        type: '',
	        severity: '1'
	    };

      	caseService.status = 'closed';
      	caseService.product = 'Red Hat Enterprise Linux';
      	caseService.owner = '';
      	caseService.type = '';
      	caseService.severity = '1';


      	var deferred = q.defer();
		spyOn(strataService.cases, 'filter').andReturn(deferred.promise);
		deferred.resolve(); 
		mockScope.$broadcast('auth-login-success'); 
		searchCaseService.doFilter();
		expect(strataService.cases.filter).toHaveBeenCalledWith(filterParams);

  	});



});