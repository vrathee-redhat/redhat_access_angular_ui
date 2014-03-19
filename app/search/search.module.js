/**
 * @ngdoc module
 * @name  
 *
 * @description
 *   
 */
angular.module('RedhatAccess.search', [
	'ui.router',
	'RedhatAccess.security'
])
	.config(['$stateProvider',
		function($stateProvider) {
			$stateProvider.state('search', {
				url: "/search",
				controller: 'SearchController',
				templateUrl: 'search/views/search.html'
			}).state('search_accordion', {     //TEMPORARY
				url: "/search2",
				controller: 'SearchController',
				templateUrl: 'search/views/accordion_search.html'

			});
		}
	])
	.controller('SearchController', ['$scope',
		'SearchResultsService',
		function($scope,SearchResultsService) {
			$scope.results = SearchResultsService.results;
			$scope.selectedSolution = SearchResultsService.currentSelection;
			onFailure = function() {
				//alert("Failed");
			};
			clearResults = function() {
				SearchResultsService.setSelected({});
				SearchResultsService.clear();
			};


			addResult = function(result) {
				$scope.$apply(function() {
					SearchResultsService.add(result);
				});

			};

			$scope.solutionSelected = function(index) {
				var response = $scope.results[index];
				SearchResultsService.setSelected(response);

			};

			$scope.search = function(searchStr) {
				clearResults();
				strata.search($scope.searchStr,
					function(response) {
						addResult(response);
					},
					onFailure,
					10,
					true
				);

			};

			$scope.$watch(function() {
					return SearchResultsService.currentSelection
				},
				function(newVal) {
					$scope.selectedSolution = newVal;
				}
			)
		}
	])
	.directive('accordionSearchResults', function() {
		return {
			restrict: 'AE',
			scope: false,
			templateUrl: 'search/views/accordion_search_results.html'
		};
	})
	.directive('listSearchResults', function() {
		return {
			restrict: 'AE',
			scope: false,
			templateUrl: 'search/views/list_search_results.html'
		};
	})
	.directive('searchForm', function() {
		return {
			restrict: 'AE',
			scope: false,
			templateUrl: 'search/views/search_form.html'
		};
	})
	.directive('standardSearch', function() {
		return {
			restrict: 'AE',
			scope: false,
			templateUrl: 'search/views/standard_search.html'
		};
	})
	.directive('resultDetailDisplay', function() {
		return {
			restrict: 'AE',
			scope: {
				result: '='
			},
			link: function(scope, element, attr) {
				scope.isSolution = function() {
					if (scope.result !== undefined && scope.result.resource_type !== undefined) {
						if (scope.result.resource_type === "Solution") {
							return true;
						} else {
							return false;
						}
					}
					return false;
				};
				scope.isArticle = function() {
					if (scope.result !== undefined && scope.result.resource_type !== undefined) {
						if (scope.result.resource_type === "Article") {
							return true;
						} else {
							return false;
						}
					}
					return false;
				};
				scope.getSolutionResolution = function() {
					var resolution_html = '';
					if (scope.result.resolution !== undefined) {
						resolution_html = scope.result.resolution.html;
					}
					return resolution_html;
				};

				scope.getArticleHtml = function() {
					if (scope.result === undefined) {
						return '';
					}
					if (scope.result.body !== undefined) {
						return scope.result.body;
					} else {
						return '';
					}
				};

			},
			templateUrl: 'search/views/resultDetail.html'
		};
	})
	.factory('SearchResultsService', ['$rootScope','AUTH_EVENTS',

		function($rootScope, AUTH_EVENTS) {
			var service = {
				results: [],
				currentSelection: {},
				add: function(result) {
					this.results.push(result);
				},
				clear: function() {
					this.results.length = 0;
					this.setSelected({});
				},
				setSelected: function(selection) {
					this.currentSelection = selection;
				}
			};

			$rootScope.$on(AUTH_EVENTS.logoutSuccess, function() {
				service.clear.apply(service);
			});
			return service;
		}
	]);