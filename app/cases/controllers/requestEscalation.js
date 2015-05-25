'use strict';
/*global $ */
angular.module('RedhatAccess.cases').controller('RequestEscalation', [
    '$scope',
    '$modal',
    function ($scope, $modal) {
		$scope.requestManagementEscalation = function () {
	        $modal.open({
	            templateUrl: 'cases/views/requestManagementEscalationModal.html',
	            controller: 'RequestManagementEscalationModal'
	        });
	    };
    }
]);
