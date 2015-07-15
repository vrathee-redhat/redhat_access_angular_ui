'use strict';
/*global $ */
/*jshint camelcase: false*/
angular.module('RedhatAccess.ascension').controller('BomgarSessionDetails', [
    '$scope',
    '$modalInstance',
    'CaseDiscussionService',
    function ($scope, $modalInstance, CaseDiscussionService) {
        $scope.CaseDiscussionService = CaseDiscussionService;

        $scope.closeModal = function () {
            $modalInstance.close();
        };

    }
]);

