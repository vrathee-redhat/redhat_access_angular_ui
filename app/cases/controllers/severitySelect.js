'use strict';

export default class SeveritySelect {
    constructor($scope) {
        'ngInject';

        // INIT
        $scope.ie8 = window.ie8;
        $scope.openedDetails = {};
        angular.forEach($scope.severities, function (severity) {
            $scope.openedDetails[severity.name] = false;
        });

        $scope.toggleDetails = function (severity, event) {
            if (event.stopPropagation) { // we don't want to toggle severity
                event.stopPropagation();
            } else { // for IE8+
                event.returnValue = false;
                event.cancelBubble = true;
            }
            $scope.openedDetails[severity.name] = !$scope.openedDetails[severity.name];
        };

        $scope.$watch("createdCase.severity", function () {
            $scope.severityChange();
        });
    }
}
