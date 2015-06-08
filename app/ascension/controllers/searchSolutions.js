'use strict';
/*jshint camelcase: false */
angular.module('RedhatAccess.ascension').controller('SearchSolutions', [
    '$scope',
    '$sanitize',
    'strataService',
    'CaseDetailsService',
    function ($scope, $sanitize, strataService, CaseDetailsService) {

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
    }
]);
