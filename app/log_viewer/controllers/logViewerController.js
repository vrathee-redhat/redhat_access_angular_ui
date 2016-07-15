'use strict';

export default class logViewerController {
    constructor($scope, SearchResultsService) {
        'ngInject';
        
        $scope.isDisabled = true;
        $scope.textSelected = false;
        $scope.showSolutions = false;
        $scope.enableDiagnoseButton = function () {
            //Gotta wait for text to "unselect"
            $scope.sleep(1, $scope.checkTextSelection);
        };
        $scope.checkTextSelection = function () {
            if (strata.utils.getSelectedText()) {
                $scope.textSelected = true;
                if (SearchResultsService.searchInProgress.value) {
                    $scope.isDisabled = true;
                } else {
                    $scope.isDisabled = false;
                }
            } else {
                $scope.textSelected = false;
                $scope.isDisabled = true;
            }
            $scope.$apply();
        };
        $scope.sleep = function (millis, callback) {
            setTimeout(function () {
                callback();
            }, millis);
        };
        $scope.toggleSolutions = function () {
            $scope.showSolutions = !$scope.showSolutions;
        };
    }
}
