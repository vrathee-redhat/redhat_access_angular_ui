'use strict';
angular.module('RedhatAccess.cases').controller('ListAttachments', [
    '$scope',
    'AttachmentsService',
    function ($scope, AttachmentsService) {
        $scope.AttachmentsService = AttachmentsService;
    }
]);