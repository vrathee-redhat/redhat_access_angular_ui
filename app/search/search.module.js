/**
 * @ngdoc module
 * @name
 *
 * @description
 *
 */
angular.module('RedhatAccess.search', [
	'ui.router',
	'templates.app',
	'RedhatAccess.security',
	'ui.bootstrap',
	'ngSanitize'
])
	.constant('RESOURCE_TYPES', {
		article: 'Article',
		solution: 'Solution',

	})
	.constant('SEARCH_PARAMS', {
		limit: 10

	})
	.config(['$stateProvider',
		function ($stateProvider) {
			$stateProvider.state('search', {
				url: "/search",
				controller: 'SearchController',
				templateUrl: 'search/views/search.html'
			}).state('search_accordion', { //TEMPORARY
				url: "/search2",
				controller: 'SearchController',
				templateUrl: 'search/views/accordion_search.html'

			});
		}
	])
	.controller('SearchController', ['$scope',
		'SearchResultsService', 'SEARCH_PARAMS',
		function ($scope, SearchResultsService) {
			$scope.results = SearchResultsService.results;
			$scope.selectedSolution = SearchResultsService.currentSelection;

			clearResults = function () {
				SearchResultsService.clear();
			};


			$scope.solutionSelected = function (index) {
				var response = $scope.results[index];
				SearchResultsService.setSelected(response);

			};

			$scope.search = function (searchStr, limit) {
				SearchResultsService.search(searchStr, limit);
			};

			$scope.diagnose = function (data, limit) {
				SearchResultsService.diagnose(data, limit);
			};


			$scope.$watch(function () {
					return SearchResultsService.currentSelection
				},
				function (newVal) {
					$scope.selectedSolution = newVal;
				}
			);


		}
	])
	.directive('accordionSearchResults', function () {
		return {
			restrict: 'AE',
			scope: false,
			templateUrl: 'search/views/accordion_search_results.html'
		};
	})
	.directive('listSearchResults', function () {
		return {
			restrict: 'AE',
			scope: false,
			templateUrl: 'search/views/list_search_results.html'
		};
	})
	.directive('searchForm', function () {
		return {
			restrict: 'AE',
			scope: false,
			templateUrl: 'search/views/search_form.html'
		};
	})
	.directive('standardSearch', function () {
		return {
			restrict: 'AE',
			scope: false,
			templateUrl: 'search/views/standard_search.html'
		};
	})
	.directive('resultDetailDisplay', ['RESOURCE_TYPES',
		function (RESOURCE_TYPES) {
			return {
				restrict: 'AE',
				scope: {
					result: '='
				},
				link: function (scope, element, attr) {
					scope.isSolution = function () {
						if (scope.result !== undefined && scope.result.resource_type !== undefined) {
							if (scope.result.resource_type === RESOURCE_TYPES.solution) {
								return true;
							} else {
								return false;
							}
						}
						return false;
					};
					scope.isArticle = function () {
						if (scope.result !== undefined && scope.result.resource_type !== undefined) {
							if (scope.result.resource_type === RESOURCE_TYPES.article) {
								return true;
							} else {
								return false;
							}
						}
						return false;
					};
					scope.getSolutionResolution = function () {
						var resolution_html = '';
						if (scope.result.resolution !== undefined) {
							resolution_html = scope.result.resolution.html;
						}
						return resolution_html;
					};

					scope.getArticleHtml = function () {
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
		}
	])
	.factory('SearchResultsService', ['$rootScope', 'AUTH_EVENTS', 'RESOURCE_TYPES', 'SEARCH_PARAMS',

		function ($rootScope, AUTH_EVENTS, RESOURCE_TYPES, SEARCH_PARAMS) {
			var service = {
				results: [],
				currentSelection: {},
				add: function (result) {
					this.results.push(result);
				},
				clear: function () {
					this.results.length = 0;
					this.setSelected({});
				},
				setSelected: function (selection) {
					this.currentSelection = selection;
				},
				search: function (searchString, limit) {
					var that = this;
					if ((limit === undefined) || (limit < 1)) limit = SEARCH_PARAMS.limit;
					this.clear();
					strata.search(
						searchString,
						function (resourceType, response) {
							response.resource_type = resourceType;
							$rootScope.$apply(function () {
								that.add(response);
							});
						},
						function (error) {
							console.log("search failed");
						},
						limit,
						true
					);
				},
				searchSolutions: function (searchString, limit) {
					var that = this;
					if ((limit === undefined) || (limit < 1)) limit = SEARCH_PARAMS.limit;
					this.clear();
					strata.solutions.search(
						searchString,
						function (response) {
							//console.log(angular.toJson(response));
							$rootScope.$apply(function () {
								//console.log(angular.toJson(response));
								response.forEach(function (entry) {
									entry.resource_type = RESOURCE_TYPES.solution;
									that.add(entry);
									//console.log(angular.toJson(entry, true));
								});
							});
						},
						function (error) {
							console.log("search failed");
						},
						limit,
						false
					);
				},
				searchArticles: function (searchString, limit) {
					var that = this;
					if ((limit === undefined) || (limit < 1)) limit = SEARCH_PARAMS.limit;
					this.clear();
					strata.articles.search(
						searchString,
						function (response) {
							response.resource_type = RESOURCE_TYPES.article;
							$rootScope.$apply(function () {
								that.add(response);
							});
						},
						function (error) {
							console.log("search failed");
						},
						limit,
						true
					);
				},
				diagnose: function (searchString, limit) {
					var that = this;
					if ((limit === undefined) || (limit < 1)) limit = SEARCH_PARAMS.limit;
					this.clear();
					strata.diagnose(
						searchString,
						function (response) {
							//response.resource_type = resourceType;
							response.resource_type = RESOURCE_TYPES.solution;
							$rootScope.$apply(function () {
								that.add(response);
							});
						},
						function (error) {
							console.log("search failed");
						},
						limit,
						true
					);
				}



			};

			$rootScope.$on(AUTH_EVENTS.logoutSuccess, function () {
				service.clear.apply(service);
			});
			return service;
		}
	]);