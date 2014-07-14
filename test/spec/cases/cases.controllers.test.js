'use strict';

describe('Case Controllers', function() {

		var caseService;
		var strataService;
		var recommendationsService;
		var mockScope;
		var q;

		beforeEach(angular.mock.module('RedhatAccess.cases'));
		beforeEach(function () {
				inject(function ($injector, $rootScope, $q) {
						caseService = $injector.get('CaseService');
						q = $q;
						strataService = $injector.get('strataService');
						recommendationsService = $injector.get('RecommendationsService');
						mockScope = $rootScope.$new();					
				})
		});

		it('should have a function for updating case details', inject(function ($controller) {

				$controller('DetailsSection', {
						$scope: mockScope,
						CaseService: caseService,
						strataService: strataService
				});

				var caseJSON = {};
				caseService.case.case_number = '1234';
				expect(mockScope.updateCase).toBeDefined();
				var deferred = q.defer();
				spyOn(strataService.cases, 'put').andReturn(deferred.promise);
		        deferred.resolve();
		        mockScope.updateCase();
		        expect(strataService.cases.put).toHaveBeenCalledWith("1234", caseJSON);
				
		}));

		it('should have a function for adding comments to case', inject(function ($controller) {

				$controller('AddCommentSection', {
						$scope: mockScope,
						CaseService: caseService,
						strataService: strataService
				});

				caseService.case.case_number = '1234';
				caseService.commentText = 'test comment';
				expect(mockScope.addComment).toBeDefined();
				var deferred = q.defer();
				spyOn(strataService.cases.comments, 'post').andReturn(deferred.promise);
		        deferred.resolve();
				mockScope.addComment();
				expect(strataService.cases.comments.post).toHaveBeenCalledWith("1234", 'test comment');			

		
		}));

		it('should have a function for adding draft comments to case', inject(function ($controller) {

				$controller('AddCommentSection', {
						$scope: mockScope,
						CaseService: caseService,
						strataService: strataService
				});

				caseService.case.case_number = '1234';
				caseService.commentText = 'test comment';
				caseService.draftComment = {};
				caseService.draftComment.id = '1111';
				expect(mockScope.addComment).toBeDefined();
				var deferred = q.defer();
				spyOn(strataService.cases.comments, 'put').andReturn(deferred.promise);
		        deferred.resolve();
				mockScope.addComment();
				expect(strataService.cases.comments.put).toHaveBeenCalledWith("1234", 'test comment', false, '1111');						

		
		}));

		it('should have a function for fetching recommendations', inject(function ($controller) {

				$controller('New', {
						$scope: mockScope,
						RecommendationsService: recommendationsService,
						strataService: strataService
				});

				var newData = {
			        product: 'Red Hat Enterprise Linux',
			        version: '6.0',
			        summary: 'test case summary',
			        description: 'test case description'		        
      			};

      			caseService.case.product = 'Red Hat Enterprise Linux';
		        caseService.case.version = '6.0';
		        caseService.case.summary = 'test case summary';
		        caseService.case.description = 'test case description';

      			expect(mockScope.getRecommendations).toBeDefined();
      			var deferred = q.defer();
				spyOn(strataService, 'problems').andReturn(deferred.promise);
		        deferred.resolve();
				mockScope.getRecommendations();
				expect(strataService.problems).toHaveBeenCalledWith(newData,5);						

		
		}));
	
});