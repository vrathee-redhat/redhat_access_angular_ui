'use strict';
angular.module('RedhatAccess.cases').controller('DescriptionSection', [
    '$scope',
    'CaseService',
    function ($scope, CaseService) {
        $scope.CaseService = CaseService;

        $scope.updateCase = function(){
        	CaseService.updateCase().then(function () {
            }, function (error) {
                AlertService.addStrataErrorMessage(error);
            });
        };
    }
]);