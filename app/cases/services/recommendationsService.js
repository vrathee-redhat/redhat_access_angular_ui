'use strict';
/*jshint unused:vars */
/*jshint camelcase: false */
angular.module('RedhatAccess.cases').service('RecommendationsService', [
    'strataService',
    'CaseService',
    'AlertService',
    '$q',
    function (strataService, CaseService, AlertService, $q) {
        this.recommendations = [];
        this.pinnedRecommendations = [];
        this.handPickedRecommendations = [];
        var currentData = {
                product: null,
                version: null,
                summary: null,
                description: null
            };
        this.loadingRecommendations = false;
        var setCurrentData = function () {
            currentData = {
                product: CaseService.kase.product,
                version: CaseService.kase.version,
                summary: CaseService.kase.summary,
                description: CaseService.kase.description
            };
        };
        setCurrentData();
        this.clear = function () {
            this.recommendations = [];
        };
        this.pageSize = 4;
        this.maxSize = 10;
        this.recommendationsOnScreen = [];
        this.selectPage = function (pageNum) {
            //filter out pinned recommendations
            angular.forEach(this.pinnedRecommendations, angular.bind(this, function (pinnedRec) {
                angular.forEach(this.recommendations, angular.bind(this, function (rec, index) {
                    if (angular.equals(rec.id, pinnedRec.id)) {
                        this.recommendations.splice(index, 1);
                    }
                }));
            }));
            angular.forEach(this.handPickedRecommendations, angular.bind(this, function (handPickedRec) {
                angular.forEach(this.recommendations, angular.bind(this, function (rec, index) {
                    if (angular.equals(rec.id, handPickedRec.id)) {
                        this.recommendations.splice(index, 1);
                    }
                }));
            }));
            var recommendations = this.pinnedRecommendations.concat(this.recommendations);
            recommendations = this.handPickedRecommendations.concat(recommendations);
            var start = this.pageSize * (pageNum - 1);
            var end = start + this.pageSize;
            end = end > recommendations.length ? recommendations.length : end;
            this.recommendationsOnScreen = recommendations.slice(start, end);
            this.currentPage = pageNum;
        };
        this.populatePinnedRecommendations = function () {
            var promises = [];
            if (CaseService.kase.recommendations) {
                //Push any pinned recommendations to the front of the array
                if (CaseService.kase.recommendations.recommendation) {
                    var promise = {};
                    angular.forEach(CaseService.kase.recommendations.recommendation, angular.bind(this, function (rec) {
                        if (rec.pinned_at) {
                            promise = strataService.solutions.get(rec.resource_id).then(angular.bind(this, function (solution) {
                                    solution.pinned = true;
                                    this.pinnedRecommendations.push(solution);
                                }), function (error) {
                                    AlertService.addStrataErrorMessage(error);
                                });
                            promises.push(promise);
                        } else if (rec.linked) {
                            promise = strataService.solutions.get(rec.resource_id).then(angular.bind(this, function (solution) {
                                    //solution.pinned = true;
                                    solution.handPicked = true;
                                    this.handPickedRecommendations.push(solution);
                                }), function (error) {
                                    AlertService.addStrataErrorMessage(error);
                                });
                            promises.push(promise);
                        }
                    }));
                }
            }
            var masterPromise = $q.all(promises);
            masterPromise.then(angular.bind(this, function () {
                this.selectPage(1);
            }));
            return masterPromise;
        };
        this.failureCount = 0;
        this.populateRecommendations = function (max) {
            var masterDeferred = $q.defer();
            masterDeferred.promise.then(angular.bind(this, function() {this.selectPage(1);}));
            var newData = {
                    product: CaseService.kase.product,
                    version: CaseService.kase.version,
                    summary: CaseService.kase.summary,
                    description: CaseService.kase.description
                };
            if (newData.product !== undefined || newData.version !== undefined || newData.summary !== undefined || newData.description !== undefined || (!angular.equals(currentData, newData) && !this.loadingRecommendations || this.recommendations.length < 1 && this.failureCount < 10)) {
                this.loadingRecommendations = true;
                setCurrentData();
                var deferreds = [];
                strataService.recommendations(currentData, max).then(angular.bind(this, function (solutions) {
                    //retrieve details for each solution
                    solutions.forEach(function (solution) {
                        var deferred = strataService.solutions.get(solution.resource_uri);
                        deferreds.push(deferred);
                    });
                    $q.all(deferreds).then(angular.bind(this, function (solutions) {
                        this.recommendations = [];
                        solutions.forEach(angular.bind(this, function (solution) {
                            if (solution !== undefined) {
                                solution.resource_type = 'Solution';
                                this.recommendations.push(solution);
                            }
                        }));
                        this.loadingRecommendations = false;
                        masterDeferred.resolve();
                    }), angular.bind(this, function (error) {
                        this.loadingRecommendations = false;
                        masterDeferred.resolve();
                    }));
                }), angular.bind(this, function (error) {
                    masterDeferred.reject();
                    this.failureCount++;
                    this.populateRecommendations(12);
                }));
            } else {
                masterDeferred.resolve();
            }
            return masterDeferred.promise;
        };
    }
]);
