'use strict';

describe('Case Controllers', function() {

	var mockRecommendationsService;
	var mockSearchResultsService;
	var mockStrataService;
    var mockStrataDataService;
    var mockCaseService;
	var mockScope;
	var q;

	beforeEach(angular.mock.module('RedhatAccess.cases'));
	beforeEach(angular.mock.module('RedhatAccess.mock'));

	beforeEach(inject(function ($injector, $rootScope, $q) {
		q = $q;
		mockStrataService = $injector.get('strataService');
		mockCaseService = $injector.get('MockCaseService');
		mockRecommendationsService = $injector.get('MockRecommendationsService');
		mockSearchResultsService = $injector.get('MockSearchResultsService');
		mockStrataDataService = $injector.get('MockStrataDataService');
		mockScope = $rootScope.$new();					
			
	}));

	//Suite for DetailsSection
	describe('DetailsSection', function() {

		it('should have a function for updating case details resolved', inject(function ($controller) {

	        $controller('DetailsSection', {
	            $scope: mockScope,
	            CaseService: mockCaseService,
	            strataService: mockStrataService
	        });

	        mockScope.caseDetails = {
	          $valid: true,
	          $setPristine: function() {}
	        };

	        mockCaseService.kase.case_number = '1234';
	        mockCaseService.kase.type = 'bug';
	        mockCaseService.kase.severity = 'high';
	        mockCaseService.kase.status = 'open';
	        mockCaseService.kase.alternate_id = '12345';
	        mockCaseService.kase.product = 'Red Hat Enterprise Linux';
	        mockCaseService.kase.version = '6.0';
	        mockCaseService.kase.summary = 'Test Summary';
	        mockCaseService.kase.group = {
	          name: 'Test Group',
	          number: '123456'
	        };
	        mockCaseService.kase.fts = true;
	        mockCaseService.kase.contact_info24_x7 = 'test@test.com';
	        expect(mockScope.updateCase).toBeDefined();
	        mockScope.updateCase();
	        spyOn(mockStrataService.cases, 'put').andCallThrough();
	        mockScope.$root.$digest();
	        expect(mockScope.updatingDetails).toBe(false);
        
	  	}));

		it('should have a function to get Product Versions resolved', inject(function ($controller) {

	        $controller('DetailsSection', {
	            $scope: mockScope,
	            CaseService: mockCaseService,
	            strataService: mockStrataService
	        });
	        
	        mockCaseService.kase.product = {
	          name: 'Red Hat Enterprise Linux',
	          code: '123456'
	        };
	       
	        expect(mockScope.getProductVersions).toBeDefined();
	        mockScope.getProductVersions();
	        spyOn(mockStrataService.products, 'versions').andCallThrough();
	        mockScope.$root.$digest();
	        expect(mockCaseService.versions).toEqual(mockStrataDataService.mockVersions);   
	        
	  	}));

	  	it('should have a function to get Product Versions rejected', inject(function ($controller) {

	        $controller('DetailsSection', {
	            $scope: mockScope,
	            CaseService: mockCaseService,
	            strataService: mockStrataService
	        });

	        mockCaseService.kase.product = {
	          name: 'Red Hat Enterprise Linux',
	          code: '123456'
	        };
	       
	        expect(mockScope.getProductVersions).toBeDefined();
	        mockStrataService.rejectCalls();
	        spyOn(mockStrataService.products, 'versions').andCallThrough();
	        mockScope.getProductVersions();        
	        mockScope.$root.$digest();
	        expect(mockCaseService.versions).toEqual([]);   
	        
	  	}));
	});

	//Suite for AddCommentSection
	describe('AddCommentSection', function() {

		it('should have a function for adding comments to case resolved', inject(function ($controller) {

	        $controller('AddCommentSection', {
	          	$scope: mockScope,
	          	CaseService: mockCaseService,
	          	strataService: mockStrataService
	        });

	      	mockCaseService.kase.case_number = '1234';
	      	mockCaseService.commentText = 'test comment';
	      	mockScope.saveDraftPromise = '3'
	      	mockCaseService.kase.status = {
	          name: 'Closed'
	        };
	        expect(mockScope.addComment).toBeDefined();
	      	mockScope.addComment();
	      	spyOn(mockStrataService.cases.comments, 'post').andCallThrough();  
	     	mockScope.$root.$digest();  
	      	expect(mockCaseService.kase.status.name).toEqual("Waiting on Red Hat");
	  
	  	}));

	  	it('should have a function for adding comments to case rejected', inject(function ($controller) {

	        $controller('AddCommentSection', {
	          	$scope: mockScope,
	          	CaseService: mockCaseService,
	          	strataService: mockStrataService
	        });

	      	mockCaseService.kase.case_number = '1234';
	      	mockCaseService.commentText = 'test comment';
	      	mockScope.saveDraftPromise = '3'
	      	mockCaseService.kase.status = {
	          name: 'Closed'
	        };
	      	expect(mockScope.addComment).toBeDefined();
	      	mockStrataService.rejectCalls();
	      	spyOn(mockStrataService.cases.comments, 'post').andCallThrough();
	      	mockScope.addComment();	      	  
	     	mockScope.$root.$digest();  
	      	expect(mockCaseService.kase.status.name).toEqual("Closed");
	      	expect(mockScope.addingComment).toBe(false);
	  
	  	}));

	  	it('should have a function for adding draft comments to case', inject(function ($controller) {

		    $controller('AddCommentSection', {
		        $scope: mockScope,
		        CaseService: mockCaseService,
		        strataService: mockStrataService
		    });

		    mockCaseService.kase.case_number = '1234';
		    mockCaseService.commentText = 'test comment';
		    mockScope.saveDraftPromise = '3'
		    mockCaseService.kase.status = {
	          name: 'Closed'
	        };
		    mockCaseService.draftComment = {};
		    mockCaseService.draftComment.id = '1111';
		    expect(mockScope.addComment).toBeDefined();
		    mockScope.addComment();      
		    spyOn(mockStrataService.cases.comments, 'put').andCallThrough();  
		    mockScope.$root.$digest();        
	        
	  	}));

	  	it('should have a function for saving non draft comments', inject(function ($controller) {

		    $controller('AddCommentSection', {
		        $scope: mockScope,
		        CaseService: mockCaseService,
		        strataService: mockStrataService
		    });

		    mockCaseService.kase.case_number = '1234';
		    mockCaseService.commentText = 'test comment';
		    expect(mockScope.saveDraft).toBeDefined();
		    mockScope.saveDraft();      
		    spyOn(mockStrataService.cases.comments, 'post').andCallThrough();  
		    mockScope.$root.$digest(); 
		    expect(mockScope.draftSaved).toBe(true);
		    expect(mockCaseService.draftComment.case_number).toEqual('1234');       
		    
		}));

		it('should have a function for saving draft comments', inject(function ($controller) {

		    $controller('AddCommentSection', {
		        $scope: mockScope,
		        CaseService: mockCaseService,
		        strataService: mockStrataService
		    });

		    mockCaseService.kase.case_number = '1234';
		    mockCaseService.commentText = 'test comment';
		    mockCaseService.draftComment = {};
		    expect(mockScope.saveDraft).toBeDefined();
		    mockScope.saveDraft();      
		    spyOn(mockStrataService.cases.comments, 'put').andCallThrough();  
		    mockScope.$root.$digest(); 
		    expect(mockScope.draftSaved).toBe(true);
		    expect(mockCaseService.draftComment.text).toEqual('test comment');       
		    
		}));

		it('should have a function for saving draft comments rejected', inject(function ($controller) {

		    $controller('AddCommentSection', {
		        $scope: mockScope,
		        CaseService: mockCaseService,
		        strataService: mockStrataService
		    });

		    mockCaseService.kase.case_number = '1234';
		    mockCaseService.commentText = 'test comment';
		    mockCaseService.draftComment = {};
		    expect(mockScope.saveDraft).toBeDefined();
		    mockStrataService.rejectCalls();
		    spyOn(mockStrataService.cases.comments, 'put').andCallThrough(); 
		    mockScope.saveDraft();		     
		    mockScope.$root.$digest(); 
		    expect(mockScope.savingDraft).toBe(false);      
		    
		}));

		it('should have a function for on New Comment Keypress', inject(function ($controller) {

	        $controller('AddCommentSection', {
	          	$scope: mockScope,
	          	CaseService: mockCaseService,
	          	strataService: mockStrataService
	        });

	        mockScope.addingComment = false;
	        mockCaseService.commentText = 'test comment';
	        expect(mockScope.onNewCommentKeypress).toBeDefined();
	        mockScope.onNewCommentKeypress();           
	        
	  	}));

	});

	//Suite for New
	describe('New', function() {

		it('should have a function for fetching recommendations resolved', inject(function ($controller) {

	        $controller('New', {
	            $scope: mockScope,
	            RecommendationsService: mockRecommendationsService,
	            SearchResultsService: mockSearchResultsService,
	            strataService: mockStrataService
	        });

	        mockScope.NEW_CASE_CONFIG.showRecommendations = true;
	        expect(mockScope.getRecommendations).toBeDefined();
	        mockScope.getRecommendations();  
	        spyOn(mockRecommendationsService, 'populateRecommendations').andCallThrough();
	        mockScope.$root.$digest();          
	        expect(mockSearchResultsService.results).toEqual(mockStrataDataService.mockSolutions); 

  		}));

  		it('should have a function for getting Product Versions resolved', inject(function ($controller) {

	        $controller('New', {
	            $scope: mockScope,
	            CaseService: mockCaseService,
	            RecommendationsService: mockRecommendationsService,
	            SearchResultsService: mockSearchResultsService,
	            strataService: mockStrataService,
	            NEW_DEFAULTS: mockStrataDataService.value
	        });

	        var product = {
	          name: 'Red Hat Enterprise Linux',
	          code: '123456'
	        };

	        expect(mockScope.getProductVersions).toBeDefined();
	        mockScope.getProductVersions(product);
	        spyOn(mockStrataService.products, 'versions').andCallThrough();
	        mockScope.$root.$digest();
	        expect(mockCaseService.kase.version).toEqual(mockStrataDataService.value.version);

  		}));

  		it('should have a function for submitting case', inject(function ($controller) {

	        $controller('New', {
	            $scope: mockScope,
	            CaseService: mockCaseService,
	            RecommendationsService: mockRecommendationsService,
	            SearchResultsService: mockSearchResultsService,
	            strataService: mockStrataService,
	            NEW_DEFAULTS: mockStrataDataService.value
	        });

			mockCaseService.kase.version = '6.0';
	        mockCaseService.kase.summary = 'Test Summary';
	        mockCaseService.kase.description = 'Test Description';
	        mockCaseService.kase.severity = {
	        	name: 'high',
	        	value: '1'
	        };
	        mockCaseService.kase.product = {
	          name: 'Red Hat Enterprise Linux',
	          code: '123456'
	        };
	        mockCaseService.group = 'open';
	        mockCaseService.entitlement = 'premium';
	        mockCaseService.fts = true;
	        mockCaseService.fts_contact = 'testUser@test.com';
	        mockCaseService.owner = 'testUser';
	        mockCaseService.kase.account = {
	        	name: 'testAccount',
	        	number: '12345'
	        };	        

	        expect(mockScope.doSubmit).toBeDefined();
	        mockScope.doSubmit();
	        spyOn(mockStrataService.cases, 'post').andCallThrough();
	        mockScope.$root.$digest();
	        expect(mockScope.submittingCase).toBe(false);

  		}));

	});	
	
	
});