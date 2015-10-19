'use strict';
angular.module('RedhatAccess.cases').controller('SeveritySelect', [
    '$scope',
    function ($scope) {
    	// INIT
        $scope.openedDetails = {};
    	angular.forEach($scope.severities, function(severity) {
    		$scope.openedDetails[severity.name] = false;
    	});

        $scope.toggleDetails = function (severity, event) {
            if(event.stopPropagation) { // we don't want to toggle severity
                event.stopPropagation();
            } else { // for IE8+
                event.returnValue = false;
                event.cancelBubble = true;
            }
        	$scope.openedDetails[severity.name] = !$scope.openedDetails[severity.name];
        };

        $scope.toggleSeverity = function (severity) {
            $scope.severityModel = severity;
        };

        $scope.$watch("severityModel", function() {
            $scope.severityChange();
        });
    }
]);
