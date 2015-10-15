'use strict';
angular.module('RedhatAccess.cases').controller('SeveritySelect', [
    '$scope',
    function ($scope) {
    	// INIT
    	$scope.openedDetails = {};
    	angular.forEach($scope.severities, function(severity) {
    		$scope.openedDetails[severity.name] = false;
    	});

        $scope.toggleDetails = function (severity) {
        	$scope.openedDetails[severity.name] = !$scope.openedDetails[severity.name];
        };
    }
]);
