'use strict';

class Pagination {
    constructor($scope) {
        $scope.pageSize = 15;
        $scope.currentPage = 0;

        $scope.numberOfPages = () => Math.ceil($scope.datalength / $scope.pageSize);
        $scope.getCurrentPage = () => $scope.currentPage + 1;
        $scope.isForwardBtnDisabled = () => $scope.getCurrentPage() === $scope.numberOfPages();
        $scope.isBackBtnDisabled = () => $scope.getCurrentPage() === 1;

        $scope.goForward = () => {
            $scope.currentPage++;
            $scope.setParentScopeVariables();
        };

        $scope.goBack = () => {
            $scope.currentPage--;
            $scope.setParentScopeVariables();
        };

        $scope.setParentScopeVariables = () => $scope.setdata({
            pageSize: $scope.pageSize,
            currentPage: $scope.currentPage
        });

        $scope.setParentScopeVariables();
    }
}

export default () => ({
    template: require('../views/pagination.jade')(),
    controller: Pagination,
    scope: {
        datalength: '<',
        setdata: '&'
    }
});
