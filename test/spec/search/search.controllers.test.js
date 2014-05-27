'use strict';

describe('Search Controller', function () {

	var securityService;
	var searchResultsService;
	var mockScope;
	beforeEach(angular.mock.module('RedhatAccess.security'));
	beforeEach(angular.mock.module('RedhatAccess.search'));
	beforeEach(function () {
		inject(function ($injector, $rootScope) {
			securityService = $injector.get('securityService');
			searchResultsService = $injector.get('SearchResultsService');
			mockScope = $rootScope.$new();
		})
	});

	it('should mirror results from the SearchResultsService', inject(function ($controller) {

		searchResultsService.results = [{
			zero: '0'
		}, {
			one: '1'
		}];
		$controller('SearchController', {
			$scope: mockScope,
			SearchResultsService: searchResultsService
		});

		expect(mockScope.results).toEqual(searchResultsService.results);

	}));

	it('should have a configuration for setting a URL for opening a support case', inject(function ($controller) {

		$controller('SearchController', {
			$scope: mockScope,
            SearchResultsService: searchResultsService,
			SEARCH_CONFIG: {
				openCaseRef: '/some/url/ref',
				showOpenCaseBtn: true
			}
		});
		searchResultsService.currentSearchData.data = 'test_data';
		expect(mockScope.getOpenCaseRef).toBeDefined();
		expect(mockScope.getOpenCaseRef()).toEqual('/some/url/ref'+ '?data=' + searchResultsService.currentSearchData.data);
    }));

	it('should have a function for setting a selected article or solution', inject(function ($controller) {

		$controller('SearchController', {
			$scope: mockScope,
			SearchResultsService: searchResultsService
		});
		mockScope.results = [{
			zero: '0'
		}, {
			one: '1'
		}];
		expect(mockScope.solutionSelected).toBeDefined();
		spyOn(searchResultsService, 'setSelected');
		mockScope.solutionSelected(0);
		expect(searchResultsService.setSelected).toHaveBeenCalledWith({
			zero: '0'
		}, 0);


	}));

	it('should have a function for searching articles and solutions', inject(function ($controller) {

		$controller('SearchController', {
			$scope: mockScope,
			SearchResultsService: searchResultsService
		});
		expect(mockScope.search).toBeDefined();
		spyOn(searchResultsService, 'search');
		mockScope.search("test", 2);
		expect(searchResultsService.search).toHaveBeenCalledWith('test', 2);

	}));

	it('should have a function for diagnosing problems', inject(function ($controller) {

		$controller('SearchController', {
			$scope: mockScope,
			SearchResultsService: searchResultsService
		});
		expect(mockScope.diagnose).toBeDefined();
		spyOn(searchResultsService, 'diagnose');
		mockScope.diagnose("test", 2);
		expect(searchResultsService.diagnose).toHaveBeenCalledWith('test', 2);

	}));


});