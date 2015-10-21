'use strict';
angular.module('RedhatAccess.cases').controller('SeveritySelect', [
    '$scope',
    function ($scope) {
    	// INIT
        $scope.ie8 = window.ie8;
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
            if(!$scope.severityDisabled) {
                $scope.severityModel = severity;
            }
        };

        $scope.$watch("severityModel", function() {
            $scope.severityChange();
        });
    }
]);
