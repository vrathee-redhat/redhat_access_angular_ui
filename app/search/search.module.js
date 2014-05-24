/*jshint camelcase: false */
'use strict';
/*global strata */
/*jshint unused:vars */

/**
 * @ngdoc module
 * @name
 *
 * @description
 *
 */
angular.module('RedhatAccess.search', [
  'ui.router',
  'RedhatAccess.template',
  'RedhatAccess.security',
  'ui.bootstrap',
  'ngSanitize',
  'RedhatAccess.ui-utils',
  'RedhatAccess.header'
])
  .constant('RESOURCE_TYPES', {
    article: 'Article',
    solution: 'Solution',

  })
  .constant('SEARCH_PARAMS', {
    limit: 10

  })
  .value('SEARCH_CONFIG', {
    openCaseRef: null,
    showOpenCaseBtn: true
  })
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider.state('search', {
        url: '/search',
        controller: 'SearchController',
        templateUrl: 'search/views/search.html'
      }).state('search_accordion', { //TEMPORARY
        url: '/search2',
        controller: 'SearchController',
        templateUrl: 'search/views/accordion_search.html'

      });
    }
  ])
  .controller('SearchController', ['$scope',
    'SearchResultsService', 'SEARCH_CONFIG', 'securityService', 'AlertService',
    function ($scope, SearchResultsService, SEARCH_CONFIG, securityService, AlertService) {
      $scope.results = SearchResultsService.results;
      $scope.selectedSolution = SearchResultsService.currentSelection;
      $scope.searchInProgress = SearchResultsService.searchInProgress;
      $scope.currentSearchData = SearchResultsService.currentSearchData;



      $scope.getOpenCaseRef = function () {
        if (SEARCH_CONFIG.openCaseRef !== null) {
          //TODO data may be complex type - need to normalize to string in future
          return SEARCH_CONFIG.openCaseRef + '?data=' + SearchResultsService.currentSearchData.data;
        } else {
          return '#/case/new?data=' + SearchResultsService.currentSearchData.data;
        }
      };

      $scope.solutionSelected = function (index) {
        var response = $scope.results[index];
        SearchResultsService.setSelected(response, index);

      };

      $scope.search = function (searchStr, limit) {

        // securityService.validateLogin(true).then(
        //function (authedUser) {
        SearchResultsService.search(searchStr, limit);
        //},
        //function (error) {
        //  AlertService.addDangerMessage('You must be logged in to use this functionality.');
        //});
      };

      $scope.diagnose = function (data, limit) {
        securityService.validateLogin(true).then(
          function (authedUser) {
            SearchResultsService.diagnose(data, limit);
          },
          function (error) {
            AlertService.addDangerMessage('You must be logged in to use this functionality.');
          });
      };


      $scope.$watch(function () {
          return SearchResultsService.currentSelection;
        },
        function (newVal) {
          $scope.selectedSolution = newVal;
        }
      );

    }
  ])
  .directive('rhaAccordionSearchResults', ['SEARCH_CONFIG',
    function (SEARCH_CONFIG) {
      return {
        restrict: 'AE',
        scope: false,
        templateUrl: 'search/views/accordion_search_results.html',
        link: function (scope, element, attr) {
          scope.showOpenCaseBtn = function () {
            if (SEARCH_CONFIG.showOpenCaseBtn && (attr && attr.opencase === 'true')) {
              return true;
            } else {
              return false;
            }
          };
        }
      };
    }
  ])
  .directive('rhaListSearchResults', function () {
    return {
      restrict: 'AE',
      scope: false,
      templateUrl: 'search/views/list_search_results.html'
    };
  })
  .directive('rhaSearchForm', function () {
    return {
      restrict: 'AE',
      scope: false,
      templateUrl: 'search/views/search_form.html'
    };
  })
  .directive('rhaStandardSearch', function () {
    return {
      restrict: 'AE',
      scope: false,
      templateUrl: 'search/views/standard_search.html'
    };
  })
  .directive('rhaResultDetailDisplay', ['RESOURCE_TYPES',
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
  .factory('SearchResultsService', ['$q', '$rootScope', 'AUTH_EVENTS', 'RESOURCE_TYPES', 'SEARCH_PARAMS', 'AlertService', 'securityService',

    function ($q, $rootScope, AUTH_EVENTS, RESOURCE_TYPES, SEARCH_PARAMS, AlertService, securityService) {
      var searchArticlesOrSolutions = function (searchString, limit) {
        //var that = this;
        if ((limit === undefined) || (limit < 1)) {
          limit = SEARCH_PARAMS.limit;
        }
        service.clear();
        AlertService.clearAlerts();

        service.setCurrentSearchData(searchString, 'search');
        var deferreds = [];
        strata.search(
          searchString,
          function (entries) {
            //retrieve details for each solution
            if (entries !== undefined) {
              if (entries.length === 0) {
                AlertService.addSuccessMessage('No recommendations found.');
              }
              entries.forEach(function (entry) {
                var deferred = $q.defer();
                deferreds.push(deferred.promise);
                strata.utils.getURI(
                  entry.uri,
                  entry.resource_type,
                  function (type, info) {
                    if (info !== undefined) {
                      info.resource_type = type;
                    }
                    deferred.resolve(info);
                  },
                  function (error) {
                    deferred.resolve();
                  });
              });
            } else {
              AlertService.addSuccessMessage('No recommendations found.');
            }
            $q.all(deferreds).then(
              function (results) {
                results.forEach(function (result) {
                  if (result !== undefined) {
                    service.add(result);
                  }
                });
                service.searchInProgress.value = false;
              },
              function (error) {
                service.searchInProgress.value = false;
              }
            );
          },
          function (error) {
            console.log(error);
            $rootScope.$apply(function () {
              service.searchInProgress.value = false;
              console.log(error);
              AlertService.addDangerMessage(error);
            });
          },
          limit,
          false
        );
      };
      var searchProblems = function (data, limit) {
        if ((limit === undefined) || (limit < 1)) {
          limit = SEARCH_PARAMS.limit;
        }
        service.clear();
        AlertService.clearAlerts();
        var deferreds = [];
        service.searchInProgress.value = true;
        service.setCurrentSearchData(data, 'diagnose');
        strata.problems(
          data,
          function (solutions) {
            //retrieve details for each solution
            if (solutions !== undefined) {
              if (solutions.length === 0) {
                AlertService.addSuccessMessage('No solutions found.');
              }

              solutions.forEach(function (solution) {
                var deferred = $q.defer();
                deferreds.push(deferred.promise);
                strata.solutions.get(
                  solution.uri,
                  function (solution) {
                    deferred.resolve(solution);
                  },
                  function (error) {
                    deferred.resolve();
                  });
              });
            } else {
              AlertService.addSuccessMessage('No solutions found.');
            }
            $q.all(deferreds).then(
              function (solutions) {
                solutions.forEach(function (solution) {
                  if (solution !== undefined) {
                    solution.resource_type = RESOURCE_TYPES.solution;
                    service.add(solution);
                  }
                });
                service.searchInProgress.value = false;
              },
              function (error) {
                service.searchInProgress.value = false;
              }
            );
          },

          function (error) {
            $rootScope.$apply(function () {
              service.searchInProgress.value = false;
              AlertService.addDangerMessage(error);
            });
            console.log(error);
          },
          limit
        );
      };
      var service = {
        results: [],
        currentSelection: {
          data: {},
          index: -1
        },
        searchInProgress: {
          value: false
        },
        currentSearchData: {
          data: '',
          method: ''
        },

        add: function (result) {
          this.results.push(result);
        },
        clear: function () {
          this.results.length = 0;
          this.setSelected({}, -1);
          this.setCurrentSearchData('', '');

        },
        setSelected: function (selection, index) {
          this.currentSelection.data = selection;
          this.currentSelection.index = index;
        },
        setCurrentSearchData: function (data, method) {
          this.currentSearchData.data = data;
          this.currentSearchData.method = method;
        },
        search: function (searchString, limit) {
          this.searchInProgress.value = true;
          var that = this;
          securityService.validateLogin(true).then(
            function (authedUser) {
              searchArticlesOrSolutions(searchString, limit);
            },
            function (error) {
              that.searchInProgress.value = false;
              AlertService.addDangerMessage('You must be logged in to use this functionality.');
            });

        },
        diagnose: function (data, limit) {
          this.searchInProgress.value = true;
          var that = this;
          securityService.validateLogin(true).then(
            function (authedUser) {
              searchProblems(data, limit);
            },
            function (error) {
              that.searchInProgress.value = false;
              AlertService.addDangerMessage('You must be logged in to use this functionality.');
            });

        }
      };

      $rootScope.$on(AUTH_EVENTS.logoutSuccess, function () {
        service.clear.apply(service);
      });

      return service;
    }
  ]);