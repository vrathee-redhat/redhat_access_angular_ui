'use strict';

describe('Case Services', function() {

	var caseService;
	var searchCaseService;
	var securityService;
	var searchBoxService;
	var recommendationsService;
	var caseListService;
	var attachmentsService;
	var groupService;
	var scope;	
	var q;
	var mockStrataService;
	var mockService;	
	var deferred;

	beforeEach(angular.mock.module('RedhatAccess.cases'));
	
	beforeEach(function (){
		
		mockStrataService = {
            groups: {	          
	          	list: function (ssoUserName) {
		            deferred = q.defer();
		            return deferred.promise;	            
	          	}
	    	},
	    	accounts: {
              	users: function(accountNumber) {
	            	deferred = q.defer();
	            	return deferred.promise;
            	}
            },
            cases: {
              	comments: {
              		get: function(id) {
		            	deferred = q.defer();
		            	return deferred.promise;
            		}
            	},
            	filter: function (params) {
            		deferred = q.defer();
		            return deferred.promise;
            	},
            	attachments: {
              		post: function(id,caseNumber) {
		            	deferred = q.defer();
		            	return deferred.promise;
            		},
              		remove: function(id,caseNumber) {
		            	deferred = q.defer();
		            	return deferred.promise;
            		}
            	}
            },
            entitlements: {
              	get: function(showAll, ssoUserName) {
		           	deferred = q.defer();
		           	return deferred.promise;
            	}
            },
            solutions: {
              	get: function(showAll, ssoUserName) {
		           	deferred = q.defer();
		           	return deferred.promise;
            	}
            },
			problems: function (params) {
			 	deferred = q.defer();
			 	return deferred.promise;
			}
	    };
		module(function ($provide) {
          $provide.value('strataService', mockStrataService);
      	});

	});

	beforeEach(inject(function (_CaseService_,_SearchCaseService_,_MockService_,_SearchBoxService_,
		_RecommendationsService_,_CaseListService_,_AttachmentsService_,_GroupService_,$injector,$q,$rootScope) {
	    caseService = _CaseService_;
	    searchCaseService = _SearchCaseService_;
	    mockService = _MockService_;
	    searchBoxService = _SearchBoxService_;
	    recommendationsService = _RecommendationsService_;
	    attachmentsService = _AttachmentsService_;
	    caseListService = _CaseListService_;
	    groupService = _GroupService_;
	    scope = $rootScope.$new();
	    securityService = $injector.get('securityService');	
	    q = $q;    
	}));


	//Suite for CaseService
	describe('CaseService', function() {

		it('should have a method for defining case object', function () {
			expect(caseService.defineCase).toBeDefined();  
			var rawCase = {
				severity: '1',
				status: 'closed',
				product: 'Red Hat Enterprise Linux',
				folder_number: '1234',
				type: 'bug'
			};
			caseService.defineCase(rawCase);
			expect(caseService.kase).toEqual(rawCase);	
  		});

		it('should have a method for populating Case Groups resolved', function () {
			expect(caseService.populateGroups).toBeDefined();  
			var ssoUsername = 'testUser';
			caseService.populateGroups(ssoUsername);
			deferred.resolve(mockService.mockGroups);
			spyOn(mockStrataService.groups, 'list').andCallThrough();
			scope.$root.$digest();
			expect(caseService.groups).toEqual(mockService.mockGroups);
			expect(caseService.groupsLoading).toBe(false);		
	  	});

		it('should have a method for populating Case Groups rejected', function () {
			expect(caseService.populateGroups).toBeDefined();  
			var ssoUsername = 'testUser';
			caseService.populateGroups(ssoUsername);
			deferred.reject();
			spyOn(mockStrataService.groups, 'list').andCallThrough();
			scope.$root.$digest();
			expect(caseService.groups).toEqual([]);
			expect(caseService.groupsLoading).toBe(false);
	  	});

	  	it('should have a method for populating Users For An Account resolved', function () {
			expect(caseService.populateUsers).toBeDefined(); 
			securityService.loginStatus.orgAdmin = true; 
			caseService.account.number = '540155';
			caseService.populateUsers();
			deferred.resolve(mockService.mockUsers);
			spyOn(mockStrataService.accounts, 'users').andCallThrough();
			scope.$root.$digest();
			expect(caseService.users).toEqual(mockService.mockUsers);	
			expect(caseService.usersLoading).toBe(false);	
	  	});

	  	it('should have a method for populating Users For An Account non org admin', function () {
			expect(caseService.populateUsers).toBeDefined(); 
			securityService.loginStatus.orgAdmin = false; 
			caseService.account.number = '540155';
			caseService.populateUsers();
			expect(caseService.users).toEqual([]);	
			expect(caseService.usersLoading).toBe(false);	
	  	});

	  	it('should have a method for populating Users For An Account rejected', function () {
			expect(caseService.populateUsers).toBeDefined(); 
			securityService.loginStatus.orgAdmin = true; 
			caseService.account.number = '540155';
			caseService.populateUsers();
			deferred.reject();
			spyOn(mockStrataService.accounts, 'users').andCallThrough();
			scope.$root.$digest();
			expect(caseService.users).toEqual([]);	
			expect(caseService.usersLoading).toBe(false);		
	  	});

	  	it('should have a method for populating Case Comments resolved', function () {
			expect(caseService.populateComments).toBeDefined();  
			var caseNumber = '12345';
			caseService.populateComments(caseNumber);
			deferred.resolve(mockService.mockComments);
			spyOn(mockStrataService.cases.comments, 'get').andCallThrough();
			scope.$root.$digest();
			expect(caseService.comments).toEqual(mockService.mockComments);
	  	});

	  	it('should have a method for populating Case Comments rejected', function () {
			expect(caseService.populateComments).toBeDefined();  
			var caseNumber = '12345';
			caseService.populateComments(caseNumber);
			deferred.reject();
			spyOn(mockStrataService.cases.comments, 'get').andCallThrough();
			scope.$root.$digest();
			expect(caseService.comments).toEqual([]);
	  	});

	  	it('should have a method for populating User Entitlements resolved', function () {
			var mockEntitlements = [];
			expect(caseService.populateEntitlements).toBeDefined();  
			var ssoUsername = 'testUser';
			caseService.populateEntitlements(ssoUsername);
			deferred.resolve(mockEntitlements);
			spyOn(mockStrataService.entitlements, 'get').andCallThrough();
			scope.$root.$digest();
			expect(caseService.entitlements).toEqual(['DEFAULT']);	
	  	});

	  	it('should have a method for populating User Entitlements rejected', function () {
			expect(caseService.populateEntitlements).toBeDefined();  
			var ssoUsername = 'testUser';
			caseService.populateEntitlements(ssoUsername);
			deferred.reject();
			spyOn(mockStrataService.entitlements, 'get').andCallThrough();
			scope.$root.$digest();
			expect(caseService.entitlements).toBeUndefined();	
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
	        caseService.kase.summary = 'Test Summary';
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
	
	
	//Suite for SearchCaseService
	describe('searchCaseService', function() {

		it('should have a method to Filter/Search cases resolved for loggedin user', function () {
			expect(searchCaseService.doFilter).toBeDefined(); 
			searchCaseService.oldParams = {};			
	      	securityService.loginStatus.login = 'testUser';
	      	securityService.loginStatus.isLoggedIn = true;
	      	searchBoxService.searchTerm = 'test';

	      	var filterParams = {
		        include_closed: true,
		        count: 100,
		        product: 'Red Hat Enterprise Linux',
		        owner: 'testUser',
		        type: 'bug',
		        severity: '1'
		    };

	      	caseService.status = 'closed';
	      	caseService.product = 'Red Hat Enterprise Linux';
	      	caseService.owner = 'testUser';
	      	caseService.type = 'bug';
	      	caseService.severity = '1';
	      	
	      	searchCaseService.doFilter();
	      	deferred.resolve(mockService.mockCases);
			spyOn(mockStrataService.cases, 'filter').andCallThrough();
			scope.$root.$digest();
			expect(searchCaseService.searching).toBe(false); 
			expect(searchCaseService.cases).toEqual(mockService.mockCases);     	
  		});

		it('should have a method to Filter/Search cases rejected', function () {
			expect(searchCaseService.doFilter).toBeDefined(); 
			searchCaseService.oldParams = {};			
	      	securityService.loginStatus.login = 'testUser';
	      	securityService.loginStatus.isLoggedIn = true;

	      	var filterParams = {};
	      	searchCaseService.doFilter();
	      	deferred.reject();
			spyOn(mockStrataService.cases, 'filter').andCallThrough();
			scope.$root.$digest();
			expect(searchCaseService.searching).toBe(false); 
			expect(searchCaseService.cases).toEqual([]);     	
	  	});

	  	it('should have a method to clear the search criteria and result', function () {
			expect(searchCaseService.clear).toBeDefined(); 
			searchCaseService.oldParams = {};	
			searchBoxService.searchTerm = 'test';		
	      	searchCaseService.clear();
	      	expect(searchBoxService.searchTerm).toEqual('');
	      	expect(searchCaseService.cases).toEqual([]);    	
	  	});

	});
  	
	//Suite for RecommendationsService
	describe('RecommendationsService', function() {

		it('should have a method to populate pinned recommendations but not linked', function () {
			expect(recommendationsService.populatePinnedRecommendations).toBeDefined(); 
			var mockSolution = {
				solution_title: 'test solution title 1 ',
				solution_abstract: 'test solution abstract 1'
			};
			caseService.kase.recommendations = {"recommendation":[
		        {"linked":false,"pinned_at":true,"last_suggested_date":1398756627000,"lucene_score":141.0,"resource_id":"27450","resource_type":"Solution","resource_uri":"https://api.access.devgssci.devlab.phx1.redhat.com/rs/solutions/27450","solution_title":" test solution title 1 ","solution_abstract":"test solution abstract 1","solution_url":"https://api.access.devgssci.devlab.phx1.redhat.com/rs/solutions/27450","title":"test title 1","solution_case_count":3}
		      ]};
			recommendationsService.populatePinnedRecommendations();
			deferred.resolve(mockSolution);
			spyOn(mockStrataService.solutions, 'get').andCallThrough();
			scope.$root.$digest();
			expect(recommendationsService.pinnedRecommendations).toContain(mockSolution);
  		});

		it('should have a method to populate non pinned recommendations but linked', function () {
			expect(recommendationsService.populatePinnedRecommendations).toBeDefined(); 
			var mockSolution = {
				solution_title: 'test solution title 2 ',
				solution_abstract: 'test solution abstract 2'
			};
			caseService.kase.recommendations = {"recommendation":[
		        {"linked":true,"pinned_at":false,"last_suggested_date":1398756612000,"lucene_score":155.0,"resource_id":"637583","resource_type":"Solution","resource_uri":"https://api.access.devgssci.devlab.phx1.redhat.com/rs/solutions/637583","solution_title":"test solution title 2","solution_abstract":"test solution abstract 2","solution_url":"https://api.access.devgssci.devlab.phx1.redhat.com/rs/solutions/637583","title":"test title 2","solution_case_count":14,}
		      ]};
			recommendationsService.populatePinnedRecommendations();
			deferred.resolve(mockSolution);
			spyOn(mockStrataService.solutions, 'get').andCallThrough();
			scope.$root.$digest();
			expect(recommendationsService.handPickedRecommendations).toContain(mockSolution);
	  	});

		it('should have a method to populate recommendations', function () {
			expect(recommendationsService.populateRecommendations).toBeDefined(); 
			caseService.kase.product = 'Red Hat Enterprise Linux';
	        caseService.kase.version = '6.0';
	        caseService.kase.summary = 'Test Summary';
	        caseService.kase.description = 'Test Description';
	        var mockSolutions = [
	        	{solution_title: 'test solution title 1 ',solution_abstract: 'test solution abstract 1',uri: 'xyz'},
	        	{solution_title: 'test solution title 1 ',solution_abstract: 'test solution abstract 1',uri: 'abc'}
	        	];
	        recommendationsService.populateRecommendations(5);
	        deferred.resolve(mockSolutions);
			spyOn(mockStrataService, 'problems').andCallThrough();
			scope.$root.$digest();		
	  	});

	  	it('should have a method to define cases for case list', function () {
			expect(caseListService.defineCases).toBeDefined();
			caseListService.defineCases(mockService.mockCases); 
			expect(caseListService.cases).toEqual(mockService.mockCases);	
	  	});

	});

  	
	//Suite for AttachmentsService
	describe('AttachmentsService', function() {

		it('should have a method to delete Attachment resolved', function () {
			expect(attachmentsService.removeOriginalAttachment).toBeDefined();  
			attachmentsService.originalAttachments = [
		 		{"file_name":"abc.txt","uuid":"1234"},
		 		{"file_name":"xyz.txt","uuid":"4567"}
		 	];
		 	expect(attachmentsService.originalAttachments.length).toBe(2);
			caseService.kase.case_number = '12345';
			attachmentsService.removeOriginalAttachment(0);
			deferred.resolve();
			spyOn(mockStrataService.cases.attachments, 'remove').andCallThrough();
			scope.$root.$digest();
			expect(attachmentsService.originalAttachments.length).toBe(1);
  		});

	  	it('should have a method to delete Attachment rejected', function () {
			expect(attachmentsService.removeOriginalAttachment).toBeDefined();  
			attachmentsService.originalAttachments = [
		 		{"file_name":"abc.txt","uuid":"1234"},
		 		{"file_name":"xyz.txt","uuid":"4567"}
		 	];
		 	expect(attachmentsService.originalAttachments.length).toBe(2);
			caseService.kase.case_number = '12345';
			attachmentsService.removeOriginalAttachment(0);
			deferred.reject();
			spyOn(mockStrataService.cases.attachments, 'remove').andCallThrough();
			scope.$root.$digest();
			expect(attachmentsService.originalAttachments.length).toBe(2);
	  	});

	  	it('should have a method to add new Attachment', function () {
			expect(attachmentsService.addNewAttachment).toBeDefined();  
			var attachment = {
				file_name: 'test.txt',
				uuid: '1234'
			};
			expect(attachmentsService.updatedAttachments.length).toBe(0);	 	
			attachmentsService.addNewAttachment(attachment);
			expect(attachmentsService.updatedAttachments.length).toBe(1);
	  	});

	  	it('should have a method to remove Attachment from list', function () {
			expect(attachmentsService.removeUpdatedAttachment).toBeDefined(); 
			attachmentsService.updatedAttachments = [
		 		{"file_name":"abc.txt","uuid":"1234"},
		 		{"file_name":"xyz.txt","uuid":"4567"}
		 	];
		 	expect(attachmentsService.updatedAttachments.length).toBe(2); 
			attachmentsService.removeUpdatedAttachment(1);
			expect(attachmentsService.updatedAttachments.length).toBe(1);
			
	  	});

	  	it('should have a method to update Attachments resolved', function () {
			expect(attachmentsService.updateAttachments).toBeDefined();  
			attachmentsService.originalAttachments = [
		 		{"file_name":"abc.txt","uuid":"1234"},
		 		{"file_name":"xyz.txt","uuid":"4567"}
		 	];
		 	attachmentsService.updatedAttachments = {"attachment":[
		 		{"file_name":"abc.txt","uuid":"1234"},
		 		{"file_name":"xyz.txt","uuid":"4567"},
		 		{"file_name":"pqr.txt","uuid":"5678"}
		 	]};
		 	var uri = 'https://test.com/testUser/redhat_access.com';
			attachmentsService.updateAttachments('12345');
			deferred.resolve(uri);
			spyOn(mockStrataService.cases.attachments, 'post').andCallThrough();
			scope.$root.$digest();
			expect(attachmentsService.originalAttachments.length).toBe(3);
	  	});

	  	it('should have a method to update Attachments rejected', function () {
			expect(attachmentsService.updateAttachments).toBeDefined();  
			attachmentsService.originalAttachments = [
		 		{"file_name":"abc.txt","uuid":"1234"},
		 		{"file_name":"xyz.txt","uuid":"4567"}
		 	];
		 	attachmentsService.updatedAttachments = {"attachment":[
		 		{"file_name":"abc.txt","uuid":"1234"},
		 		{"file_name":"xyz.txt","uuid":"4567"},
		 		{"file_name":"pqr.txt","uuid":"5678"}
		 	]};
		 	
			attachmentsService.updateAttachments('12345');
			deferred.reject();
			spyOn(mockStrataService.cases.attachments, 'post').andCallThrough();
			scope.$root.$digest();
			expect(attachmentsService.originalAttachments.length).toBe(2);
	  	});

	  	it('should have a method to define Original Attachments', function () {
			expect(attachmentsService.defineOriginalAttachments).toBeDefined();  
			var attachments = [
		 		{"file_name":"abc.txt","uuid":"1234"},
		 		{"file_name":"xyz.txt","uuid":"4567"}
		 	];
			attachmentsService.defineOriginalAttachments(attachments);
			expect(attachmentsService.originalAttachments).toEqual(attachments);
			attachments = null;
			attachmentsService.defineOriginalAttachments(attachments);
			expect(attachmentsService.originalAttachments).toEqual([]);
	  	});

	});  	

});