'use strict';
/*jshint camelcase: false */
angular.module('RedhatAccess.ascension').service('SearchService', [
    '$q',
    'AlertService',
    'strataService',
    'CaseDetailsService',
    function ( $q, AlertService, strataService, CaseDetailsService) {
        this.searchedSolutions = [];
        this.numSolutions = 5;

        this.search = function(searchStr){
            strataService.solutions.search(searchStr, this.numSolutions).then(angular.bind(this, function(response){
                for(var i = 0; i < response.length; i++) {
                    angular.forEach(CaseDetailsService.kase.resourceLinks, function(r) {
                        if(r.resource.resourceId.toString() === response[i].display_id){
                            response[i].pinned = true;
                        }
                    });
                }
                this.searchedSolutions = response
            }),function (error) {
                AlertService.addStrataErrorMessage(error);
            });
        }
        this.pinSolution = function (solution) {
            solution.pinning = true;
            var doPut = function (linked) {
                var resource_id = "";
                if(solution.resource_id){
                    resource_id = solution.resource_id;
                }else if (solution.display_id){
                    resource_id = solution.display_id;
                }
                var recJSON = {
                    recommendations: {
                        recommendation: [{
                            linked: linked.toString(),
                            resourceId: resource_id,
                            resourceType: solution.resource_type,
                            title: solution.title,
                            abstract: solution.abstract
                        }]
                    }
                };
                strataService.cases.put(CaseDetailsService.getEightDigitCaseNumber(CaseDetailsService.kase.case_number), recJSON).then(angular.bind(solution, function (response) {
                    solution.pinning = false;
                    solution.pinned = !solution.pinned;
                    var resource_id = "";
                    var solution_title = "";
                    if(solution.resource_id){
                        resource_id = solution.resource_id;
                        solution_title = solution.solution_title;
                    }else if (solution.display_id){
                        resource_id = solution.display_id;
                        solution_title = solution.title;
                    }
                    if(solution.pinned){
                        var newLink = {
                            resource: {
                                id: resource_id,
                                title: solution_title
                            }
                        };
                        CaseDetailsService.kase.resourceLinks.push(newLink);
                    } else{
                        for(var i = 0; i < CaseDetailsService.kase.resourceLinks.length; i++) {
                            if(CaseDetailsService.kase.resourceLinks[i].resource.resourceId.toString() === resource_id) {
                                CaseDetailsService.kase.resourceLinks.splice(i, 1);
                                break;
                            }
                        }
                    }
                }), angular.bind(solution, function (error) {
                    solution.pinning = false;
                    AlertService.addStrataErrorMessage(error);
                }));
            };
            if (solution.pinned) {
                doPut(false);
            } else {
                doPut(true);
            }
        };
    }
]);

