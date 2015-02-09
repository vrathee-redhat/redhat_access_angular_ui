'use strict';
/*jshint camelcase: false*/
angular.module('RedhatAccess.cases').controller('EditCaseRecommendationsController', [
    'RecommendationsService',
    '$scope',
    'strataService',
    'CaseService',
    'AlertService',
    function (RecommendationsService, $scope, strataService, CaseService, AlertService) {
        $scope.RecommendationsService = RecommendationsService;
        $scope.currentRecPin = {};
        $scope.pinRecommendation = function (recommendation, $index, $event) {
            $scope.currentRecPin = recommendation;
            $scope.currentRecPin.pinning = true;
            var doPut = function (linked) {
                var recJSON = {
                    recommendations: {
                        recommendation: [{
                            linked: linked.toString(),
                            resourceId: recommendation.resource_id,
                            resourceType: 'Solution'
                        }]
                    }
                };
                strataService.cases.put(CaseService.kase.case_number, recJSON).then(function (response) {
                    if (!$scope.currentRecPin.pinned) {
                        //not currently pinned, so add it to the pinned list
                        RecommendationsService.pinnedRecommendations.push($scope.currentRecPin);
                    } else {
                        //currently pinned, so remove from pinned list
                        angular.forEach(RecommendationsService.pinnedRecommendations, function (rec, index) {
                            if (rec.id === $scope.currentRecPin.id) {
                                RecommendationsService.pinnedRecommendations.splice(index, 1);
                            }
                        });
                        //add the de-pinned rec to the top of the list
                        //this allows the user to still view the rec, or re-pin it
                        RecommendationsService.recommendations.splice(0, 0, $scope.currentRecPin);
                    }
                    $scope.currentRecPin.pinning = false;
                    $scope.currentRecPin.pinned = !$scope.currentRecPin.pinned;
                    RecommendationsService.selectPage(1);
                }, function (error) {
                    $scope.currentRecPin.pinning = false;
                    AlertService.addStrataErrorMessage(error);
                });
            };
            if (recommendation.pinned) {
                doPut(false);
            } else {
                doPut(true);
            }
        };
        $scope.triggerAnalytics = function ($event) {
            if (window.chrometwo_require !== undefined) {
                chrometwo_require(['analytics/main'], function (analytics) {
                    analytics.trigger('CaseViewRecommendationClick', $event);
                });
            }
        };
    }
]);
