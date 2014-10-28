'use strict';
/*jshint unused:vars */
/*jshint camelcase: false */
angular.module('RedhatAccess.cases').controller('CommentsSection', [
    '$scope',
    'CaseService',
    'strataService',
    '$stateParams',
    'AlertService',
    '$modal',
    '$location',
    '$anchorScroll',
    'RHAUtils',
    function ($scope, CaseService, strataService, $stateParams, AlertService, $modal, $location, $anchorScroll, RHAUtils) {
        $scope.CaseService = CaseService;
        $scope.ie8 = window.ie8;
        $scope.ie9 = window.ie9;

        CaseService.populateComments($stateParams.id).then(function (comments) {
            $scope.$on('rhaCaseSettled', function() {
                $scope.$evalAsync(function() {
                    CaseService.scrollToComment($location.search().commentId);
                });
            });
        });
        $scope.requestManagementEscalation = function () {
            $modal.open({
                templateUrl: 'cases/views/requestManagementEscalationModal.html',
                controller: 'RequestManagementEscalationModal'
            });
        };
    }
]);
