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
            $scope.recommendations = [];
            var caseData = {
                product: CaseDetailsService.kase.product,
                version: CaseDetailsService.kase.version,
                summary: CaseDetailsService.kase.summary,
                description: CaseDetailsService.kase.description
            };$scope.recommendations = [];
            strataService.recommendationsXmlHack(caseData, $scope.numSolutions, true, '%3Cstrong%3E%2C%3C%2Fstrong%3E').then(angular.bind(this, function (solutions) {
                solutions.forEach(angular.bind(this, function (solution) {
                    if (solution !== undefined) {
                        angular.forEach(CaseDetailsService.kase.resourceLinks, function(r) {
                            //if resource is linked, it should appear in red colour pin
                            if(r.resource.resourceId.toString() === solution.resource_id && r.resource.resourceStatus === 'Linked'){
                                solution.pinned = !solution.pinned;
                            }
                        });
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
                if(CaseDetailsService.kase.case_number.toString.length < 8){
                    //append 0 as strata treats case number as string with 0 as prefix
                    CaseDetailsService.kase.case_number = '0'+ CaseDetailsService.kase.case_number;
                }
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
