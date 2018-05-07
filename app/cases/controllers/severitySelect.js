'use strict';

export default class SeveritySelect {
    constructor($scope, CaseService, RHAUtils) {
        'ngInject';

        // INIT
        $scope.ie8 = window.ie8;
        $scope.openedDetails = {};
        $scope.CaseService = CaseService;
        $scope.openedDetails['4 (Low)'] = true;

        $scope.toggleDetails = function (severity, event) {
            if (event.stopPropagation) { // we don't want to toggle severity
                event.stopPropagation();
            } else { // for IE8+
                event.returnValue = false;
                event.cancelBubble = true;
            }
            $scope.openSeverityDetails(severity.name);
        };

        $scope.openSeverityDetails = function (severityName) {
            if (RHAUtils.isNotEmpty(severityName)) {
                angular.forEach($scope.severities, function (severity) {
                    $scope.openedDetails[severity.name] = (severity.name === severityName) ? true : false
                });
            }
        };

        $scope.$watch("createdCase.severity", function () {
            $scope.severityChange();
        });
    }
}
