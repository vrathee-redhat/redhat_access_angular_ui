'use strict';
angular.module('RedhatAccess.cases').controller('SeveritySelect', [
    '$scope','CaseService',
    function ($scope, CaseService) {
    	// INIT
        $scope.CaseService = CaseService;
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

        $scope.$watch("CaseService.kase.severity", function() {
            CaseService.onChangeFTSCheck();
        });
    }
]);
