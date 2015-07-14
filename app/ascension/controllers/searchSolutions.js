'use strict';
/*jshint camelcase: false */
angular.module('RedhatAccess.ascension').controller('SearchSolutions', [
    '$scope',
    '$sanitize',
    'strataService',
    'CaseDetailsService',
    'AlertService',
    'SearchResultsService',
    'SearchService',
    function ($scope, $sanitize, strataService, CaseDetailsService, AlertService, SearchResultsService, SearchService) {
        $scope.SearchService = SearchService
        $scope.SearchResultsService = SearchResultsService;
        $scope.recommendations = [];
        $scope.numSolutions = 5;

        $scope.$watch(function () {
            return CaseDetailsService.kase;
        }, function () {
            $scope.recommendations = [];
            var caseData = {
                product: CaseDetailsService.kase.product,
                version: CaseDetailsService.kase.version,
                summary: CaseDetailsService.kase.subject, //in strata Kase.summary = subject and Kase.case_summary --> Case_Summary__c, in case of UDS we get case subject = subject amd summary = Case_Summary__c
                description: CaseDetailsService.kase.description
            };
            $scope.recommendations = [];
            strataService.recommendationsXmlHack(caseData, $scope.numSolutions, true, '%3Cstrong%3E%2C%3C%2Fstrong%3E').then(angular.bind(this, function (solutions) {
                solutions.forEach(angular.bind(this, function (solution) {
                    if (solution !== undefined) {
                        angular.forEach(CaseDetailsService.kase.resourceLinks, function(r) {
                            //if resource is linked, it should appear in red colour pin
                            if(r.resource.resourceId.toString() === solution.resource_id ){
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
    }
]);
