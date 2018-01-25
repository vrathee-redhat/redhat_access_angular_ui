'use strict';

export default class RecommendationsService {
    constructor(strataService, CaseService, $q, $sanitize, NEW_CASE_CONFIG, $filter, RHAUtils) {
        'ngInject';

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
                    angular.forEach(CaseService.kase.recommendations.recommendation, angular.bind(this, function (rec) {
                        if (rec.pinned_at) {
                            rec.pinned = true;
                            this.pinnedRecommendations.push(rec);
                        }
                        if (rec.linked) {
                            rec.handPicked = true;
                            this.handPickedRecommendations.push(rec);
                        }
                    }));
                }
            }
        };

        this.validResourceType = function (resourceType) {
            if (resourceType === 'Solution' || resourceType === 'Video' || resourceType === 'CertifiedSoftware' || resourceType === 'CertifiedCloudPartner'
            || resourceType === 'Article' || resourceType === 'Errata' || resourceType === 'Vulnerability' || resourceType === 'CertifiedHardware' ||
            resourceType === 'Cve' || resourceType === 'LabInfo') {
                return true;
            } else {
                return false;
            }
        };

        this.getRecommendations = function (refreshRecommendations, max, objectToDiagnose) {
            var self = this;
            if (NEW_CASE_CONFIG.showRecommendations) {
                if (max === undefined) {
                    max = 6;
                }
                var masterDeferred = $q.defer();

                var newData = objectToDiagnose;

                if (!RHAUtils.isNotEmpty(objectToDiagnose)) {
                    newData = {
                        product: CaseService.kase.product,
                        version: CaseService.kase.version,
                        summary: CaseService.kase.summary,
                        description: CaseService.kase.description
                    };
                }

                if ((newData.product !== undefined || newData.version !== undefined || newData.summary !== undefined || newData.description !== undefined || (!angular.equals(currentData, newData) && !this.loadingRecommendations))) {
                    this.loadingRecommendations = true;
                    currentData = newData;
                    strataService.recommendationsForCase(currentData, max, 0, true, '%3Cspan%20class%3D%22recommendationsKeywords%22%3E', '%3C%2Fspan%3E') // <span class="recommendationsKeywords"></span>
                        .then(angular.bind(this, function (response) {
                            //retrieve details for each solution
                            if (refreshRecommendations) {
                                this.recommendations = [];
                            }
                            if (RHAUtils.isNotEmpty(response)) {
                                response.response.docs.forEach(angular.bind(this, function (recommendation) {
                                    if (recommendation !== undefined && this.validResourceType(recommendation.documentKind)) {
                                        recommendation.resource_type = recommendation.documentKind;
                                        recommendation.resource_id = recommendation.id;
                                        recommendation.resource_uri = recommendation.uri;
                                        recommendation.resource_view_uri = recommendation.view_uri;
                                        recommendation.title = recommendation.allTitle;
                                        recommendation.abstract = recommendation.abstract.substring(0, 300);
                                        if (RHAUtils.isNotEmpty(response.highlighting[recommendation.uri])) {
                                            try {
                                                recommendation.abstract = decodeURIComponent($sanitize(response.highlighting[recommendation.uri].abstract[0]));
                                            } catch (err) {
                                            }
                                        }

                                        //this is to sync the case detail pinned recommendation with /rs/recommendations recommendation w.r.t pinned flag so that red pin will appear in both section
                                        var pinnedRecommendation = $filter('filter')(self.pinnedRecommendations, function (rec) {
                                            return rec.resource_id === recommendation.id;
                                        })[0];
                                        if (RHAUtils.isNotEmpty(pinnedRecommendation)) {
                                            if (pinnedRecommendation.pinned_at) {
                                                recommendation.pinned = true;
                                            }
                                        }
                                        this.recommendations.push(recommendation);
                                    }
                                }));
                            }
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
}
