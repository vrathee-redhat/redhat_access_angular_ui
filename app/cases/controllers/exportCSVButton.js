'use strict';

export default class ExportCSVButton {
    constructor($scope, strataService, AlertService) {
        'ngInject';

        $scope.ie8 = window.ie8;
        $scope.ie9 = window.ie9;
        $scope.exporting = false;
        $scope.exports = function () {
            $scope.exporting = true;
            strataService.cases.csv().then(function (response) {
                $scope.exporting = false;
            }, function (error) {
                AlertService.addStrataErrorMessage(error);
            });
        };
    }
}
