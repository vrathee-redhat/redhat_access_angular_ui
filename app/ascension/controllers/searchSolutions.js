'use strict';
/*jshint camelcase: false */
angular.module('RedhatAccess.ascension').controller('SearchSolutions', [
    '$scope',
    '$sanitize',
    'strataService',
    'CaseDetailsService',
    'AlertService',
    function ($scope, $sanitize, strataService, CaseDetailsService,AlertService) {

        $scope.recommendations = [];
        $scope.numSolutions = 5;

        $scope.$watch(function () {
            return CaseDetailsService.kase;
        }, function () {
            var caseData = {
                product: CaseDetailsService.kase.product,
                version: CaseDetailsService.kase.version,
                summary: CaseDetailsService.kase.summary,
                description: CaseDetailsService.kase.description
            };
            strataService.recommendationsXmlHack(caseData, $scope.numSolutions, true, '%3Cstrong%3E%2C%3C%2Fstrong%3E').then(angular.bind(this, function (solutions) {
                solutions.forEach(angular.bind(this, function (solution) {
                    if (solution !== undefined) {
                        //TODO add code for red pin if resource is linked by matching with CaseDetailsService.Kase.resource.resourceLinks[i].resource.resourceStatus == 'Linked'
                        //add another for loop for checking with CaseDetailsService.Kase.resource.resourceLinks[i].resource.resourceStatus == 'Linked' && resource ID are equal
                        solution.resource_type = 'Solution';
                        try {
                            solution.abstract = $sanitize(solution.abstract);
                        }
                        catch(err) {
                            solution.abstract = '';
                        }
                        $scope.recommendations.push(solution);
                    }
                }));
            }), angular.bind(this, function (error) {

            }));
        });


        $scope.pinRecommendation = function (recommendation) {
            $scope.currentRecPin = recommendation;
            $scope.currentRecPin.pinning = true;
            var doPut = function (linked) {
                var recJSON = {
                    recommendations: {
                        recommendation: [{
                            linked: linked.toString(),
                            resourceId: recommendation.resource_id,
                            resourceType: recommendation.resource_type,
                            title: recommendation.title,
                            abstract: recommendation.abstract
                        }]
                    }
                };
                CaseDetailsService.kase.case_number = '0'+CaseDetailsService.kase.case_number;
                strataService.cases.put(CaseDetailsService.kase.case_number, recJSON).then(function (response) {
                    $scope.currentRecPin.pinning = false;
                    $scope.currentRecPin.pinned = !$scope.currentRecPin.pinned;
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
    }
]);
