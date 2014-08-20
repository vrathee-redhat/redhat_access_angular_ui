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
angular.module('RedhatAccess.search')
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
            $rootScope.$apply(function () {
              service.searchInProgress.value = false;
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