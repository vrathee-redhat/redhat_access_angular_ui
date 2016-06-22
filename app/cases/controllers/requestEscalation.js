'use strict';
/*global $ */
angular.module('RedhatAccess.cases').controller('RequestEscalation', [
    '$scope',
    '$uibModal',
    function ($scope, $uibModal) {
		$scope.requestManagementEscalation = function () {
	        $uibModal.open({
	            templateUrl: 'cases/views/requestManagementEscalationModal.html',
	            controller: 'RequestManagementEscalationModal'
	        });
	    };
    }
]);
