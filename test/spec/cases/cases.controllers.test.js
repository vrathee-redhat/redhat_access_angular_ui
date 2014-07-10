'use strict';

describe('Case Controllers', function() {

		var caseService;
		var strataService;
		var mockScope;
		var q;

		beforeEach(angular.mock.module('RedhatAccess.cases'));
		beforeEach(function () {
				inject(function ($injector, $rootScope, $q) {
						caseService = $injector.get('CaseService');
						q = $q;
						strataService = $injector.get('strataService');
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
	
});