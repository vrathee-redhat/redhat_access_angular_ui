'use strict';

describe('Case Controllers', function() {

	var caseService;
	var strataService;
	var mockScope;

	beforeEach(angular.mock.module('RedhatAccess.cases'));
	beforeEach(function () {
		inject(function ($injector, $rootScope) {
			caseService = $injector.get('CaseService');
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
		expect(mockScope.updateCase).toBeDefined();
		//spyOn(strataService, 'method()');
		//mockScope.updateCase("1234", caseJSON);
		//expect(strataService.cases.put).toHaveBeenCalledWith("1234", caseJSON);

	}));

});