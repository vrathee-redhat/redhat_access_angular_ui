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
		'SearchResultsService',
		function ($scope, SearchResultsService) {
			$scope.results = SearchResultsService.results;
			$scope.selectedSolution = SearchResultsService.currentSelection;
			//////////////////////
			$scope.totalItems = $scope.results.length;
			$scope.currentPage = 1;
			$scope.maxSize = 5;

			$scope.setPage = function (pageNo) {
				$scope.currentPage = pageNo;
			};

			//$scope.bigTotalItems = 175;
			//$scope.bigCurrentPage = 1;
			$scope.pageChanged = function (page) {
				$scope.currentPage = page;
				console.log("selected page is " + page);
				console.log("currentpage is " + $scope.currentPage);

				//$scope.watchPage = newPage;
			};
			///////////////////////////////////////////
			clearResults = function () {
				//SearchResultsService.setSelected({});
				SearchResultsService.clear();
			};


			// addResult = function(result) {
			// 	$scope.$apply(function() {
			// 		SearchResultsService.add(result);
			// 	});

			// };

			$scope.solutionSelected = function (index) {
				var response = $scope.results[index];
				SearchResultsService.setSelected(response);

			};

			$scope.search = function (searchStr, limit) {
				SearchResultsService.search(searchStr, limit);
				/*clearResults();
				strata.search($scope.searchStr,
					function(resourceType, response) {
						//console.log(response);
						response.resource_type = resourceType; //do this only for chained
						addResult(response);
					},
					onFailure,
					10,
					true
				);*/

			};

			$scope.$watch(function () {
					return SearchResultsService.currentSelection
				},
				function (newVal) {
					$scope.selectedSolution = newVal;
				}
			);
			// $scope.$watch(function () {
			// 		return SearchResultsService.results
			// 	},
			// 	function (newVal) {
			// 		console.log("set new result");
			// 		$scope.results = newVal;
			// 		$scope.totalItems = SearchResultsService.results.length;
			// 	}
			// );


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
	.factory('SearchResultsService', ['$rootScope', 'AUTH_EVENTS', 'RESOURCE_TYPES',

		function ($rootScope, AUTH_EVENTS, RESOURCE_TYPES) {
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
					if ((limit === undefined) || (limit < 1)) limit = 5;
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
					if ((limit === undefined) || (limit < 1)) limit = 5;
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
					if ((limit === undefined) || (limit < 1)) limit = 5;
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
					if ((limit === undefined) || (limit < 1)) limit = 5;
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