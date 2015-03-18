'use strict';
angular.module('RedhatAccess.cases').controller('DescriptionSection', [
    '$scope',
    '$modal',
    'CaseService',
    function ($scope, $modal, CaseService) {
        $scope.CaseService = CaseService;

        $scope.updateCase = function(){
        	$modal.open({
                templateUrl: 'cases/views/confirmCaseStateChangeModal.html',
                controller: 'ConfirmCaseStateChangeModal'
            });
        };
    }
]);