/*jshint camelcase: false */
'use strict';
/*jshint unused:vars */
/**
 * @ngdoc module
 * @name
 *
 * @description
 *
 */
angular.module('RedhatAccess.search').factory('SearchResultsService', [
    '$q',
    '$rootScope',
    'AUTH_EVENTS',
    'RESOURCE_TYPES',
    'SEARCH_PARAMS',
    'AlertService',
    'securityService',
    'strataService',
    'translate',
    function ($q, $rootScope, AUTH_EVENTS, RESOURCE_TYPES, SEARCH_PARAMS, AlertService, securityService, strataService, translate) {
        var searchArticlesOrSolutions = function (searchString, limit) {
            //var that = this;
            if (limit === undefined || limit < 1) {
                limit = SEARCH_PARAMS.limit;
            }
            service.clear();
            AlertService.clearAlerts();
            service.setCurrentSearchData(searchString, 'search');
            strataService.search(searchString, limit).then(
                function (results) {
                    if (results.length === 0) {
                        AlertService.addSuccessMessage(translate('No solutions found.'));
                    }
                    results.forEach(service.add);
                    service.searchInProgress.value = false;
                }, function (error) {
                    service.searchInProgress.value = false;
                });
        };
        var searchProblems = function (data, limit) {
            if (limit === undefined || limit < 1) {
                limit = SEARCH_PARAMS.limit;
            }
            service.clear();
            AlertService.clearAlerts();
            var deferreds = [];
            service.searchInProgress.value = true;
            service.setCurrentSearchData(data, 'diagnose');
            strataService.problems(data, limit).then(
                function (solutions) {
                    //retrieve details for each solution
                    if (solutions !== undefined) {
                        if (solutions.length === 0) {
                            AlertService.addSuccessMessage(translate('No solutions found.'));
                        }
                        solutions.forEach(function (solution) {
                            var deferred = $q.defer();
                            deferreds.push(deferred.promise);
                            strataService.solutions.get(solution.uri).then(
                                function (solution) {
                                    deferred.resolve(solution);
                                },
                                function (error) {
                                    deferred.resolve();
                                });
                        });
                    } else {
                        AlertService.addSuccessMessage(translate('No solutions found.'));
                    }
                    $q.all(deferreds).then(function (solutions) {
                        solutions.forEach(function (solution) {
                            if (solution !== undefined) {
                                service.add(solution);
                            }
                        });
                        service.searchInProgress.value = false;
                    }, function (error) {
                        service.searchInProgress.value = false;
                    });
                },
                function (error) {
                    service.searchInProgress.value = false;
                    AlertService.addDangerMessage(error);
                });
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
                securityService.validateLogin(true).then(function (authedUser) {
                    searchArticlesOrSolutions(searchString, limit);
                }, function (error) {
                    that.searchInProgress.value = false;
                    AlertService.addDangerMessage(translate('You must be logged in to use this functionality.'));
                });
            },
            diagnose: function (data, limit) {
                this.searchInProgress.value = true;
                var that = this;
                securityService.validateLogin(true).then(function (authedUser) {
                    searchProblems(data, limit);
                }, function (error) {
                    that.searchInProgress.value = false;
                    AlertService.addDangerMessage(translate('You must be logged in to use this functionality.'));
                });
            }
        };
        $rootScope.$on(AUTH_EVENTS.logoutSuccess, function () {
            service.clear.apply(service);
        });
        return service;
    }
]);
