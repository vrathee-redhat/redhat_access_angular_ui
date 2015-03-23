'use strict';
/*jshint unused:vars */
/*jshint camelcase: false */
angular.module('RedhatAccess.cases').service('RecommendationsService', [
    'strataService',
    'CaseService',
    'AlertService',
    '$q',
    '$sanitize',
    'NEW_CASE_CONFIG',
    function (strataService, CaseService, AlertService, $q, $sanitize, NEW_CASE_CONFIG) {
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
            currentData= {
                product: CaseService.kase.product,
                version: CaseService.kase.version,
                summary: CaseService.kase.summary,
                description: CaseService.kase.description
            };
        };
        setCurrentData();
        this.clear = function () {
            this.recommendations = [];
            this.pinnedRecommendations = [];
            this.handPickedRecommendations = [];
            currentData = {
                product: null,
                version: null,
                summary: null,
                description: null
            };
        };

        this.populatePinnedRecommendations = function () {
            if (CaseService.kase.recommendations) {
                //Push any pinned recommendations to the front of the array
                if (CaseService.kase.recommendations.recommendation) {
                    var tmpRec = [];
                    angular.forEach(CaseService.kase.recommendations.recommendation, angular.bind(this, function (rec) {
                        if (rec.pinned_at) {
                            rec.pinned = true;
                            this.pinnedRecommendations.push(rec);

                        } else if (rec.linked) {
                            rec.handPicked = true;
                            this.handPickedRecommendations.push(rec);
                        } else{
                            tmpRec.push(rec);
                        }
                    }));
                    angular.forEach(tmpRec, angular.bind(this, function (rec) {
                        this.recommendations.unshift(rec);
                    }));
                    // angular.forEach(this.pinnedRecommendations, angular.bind(this, function (rec) {
                    //     this.recommendations.unshift(rec);
                    // }));
                    // angular.forEach(this.handPickedRecommendations, angular.bind(this, function (rec) {
                    //     this.recommendations.unshift(rec);
                    // }));

                }
            }
        };

        this.getRecommendations = function (refreshRecommendations, max) {
            if (NEW_CASE_CONFIG.showRecommendations) {
                if(max === undefined){
                    max = 6;
                }
                var masterDeferred = $q.defer();

                var newData = {
                    product: CaseService.kase.product,
                    version: CaseService.kase.version,
                    summary: CaseService.kase.summary,
                    description: CaseService.kase.description
                };

                if ((newData.product !== undefined || newData.version !== undefined || newData.summary !== undefined || newData.description !== undefined || (!angular.equals(currentData, newData) && !this.loadingRecommendations))) {
                    this.loadingRecommendations = true;
                    setCurrentData();
                    strataService.recommendationsXmlHack(currentData, max, true, '%3Cstrong%3E%2C%3C%2Fstrong%3E').then(angular.bind(this, function (solutions) {
                        //retrieve details for each solution
                        if(refreshRecommendations){
                            this.recommendations = [];
                        }
                        solutions.forEach(angular.bind(this, function (solution) {
                            if (solution !== undefined) {
                                solution.resource_type = 'Solution';
                                try {
                                    solution.abstract = $sanitize(solution.abstract);
                                }
                                catch(err) {
                                    solution.abstract = '';
                                }
                                this.recommendations.push(solution);
                            }
                        }));
                        this.loadingRecommendations = false;
                        masterDeferred.resolve();
                    }), angular.bind(this, function (error) {
                        this.loadingRecommendations = false;
                        masterDeferred.reject();
                    }));
                } else {
                    masterDeferred.resolve();
                }
                return masterDeferred.promise;
            }
        };
    }
]);
