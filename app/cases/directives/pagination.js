'use strict';

class Pagination {
    constructor($scope) {
        // this is 4 because currentPage range is 0 ... n-1.
        $scope.skipSize = 4;
        $scope.onlyNumbers = /^\d+$/;
        $scope.disablePageInput = false;
        $scope.pageData = {
            currentPage: 0,
            currentPageNumber: 1,
            pageSize: 15
        };

        // ng-model-options makes input only throw even when  user clicks outside of input (blur) or presses "enter" (change)
        // http://embed.plnkr.co/2hCAxnClv68Dl5c06Brm/ https://docs.angularjs.org/api/ng/directive/ngModelOptions
        $scope.ngModelOptions = {
            updateOn: 'change blur'
        };

        $scope.numberOfPages = () => Math.ceil($scope.datalength / $scope.pageData.pageSize);
        $scope.getCurrentPage = () => $scope.pageData.currentPage + 1;
        $scope.isForwardBtnDisabled = () => $scope.getCurrentPage() === $scope.numberOfPages();
        $scope.isBackBtnDisabled = () => $scope.getCurrentPage() === 1;

        $scope.goForward = () => $scope.pageData.currentPage++;
        $scope.skipForward = () => {
            const numberOfPages = $scope.numberOfPages();
            const isLessThanNumOfPages = $scope.getCurrentPage() + $scope.skipSize < numberOfPages;

            if (isLessThanNumOfPages) {
                $scope.pageData.currentPage += $scope.skipSize;
            } else {
                $scope.pageData.currentPage = numberOfPages - 1;
            }
        };

        $scope.goBack = () => $scope.pageData.currentPage--;
        $scope.skipBack = () => {
            const isGTEZero = $scope.getCurrentPage() - $scope.skipSize >= 0;

            if (isGTEZero) {
                $scope.pageData.currentPage -= $scope.skipSize;
            } else {
                $scope.pageData.currentPage = 0;
            }
        };

        $scope.onPageChange = () => console.log('hello');

        $scope.setParentScopeVariables = () => $scope.setdata({
            pageSize: $scope.pageData.pageSize,
            currentPage: $scope.pageData.currentPage
        });

        $scope.$watch('pageData.currentPage', () => {
            $scope.pageData.currentPageNumber = $scope.pageData.currentPage + 1;
            $scope.setParentScopeVariables();
        });

        $scope.$watch('pageData.currentPageNumber', (newv) => {
            if (newv && newv >= 1 && newv <= $scope.numberOfPages()) {
                $scope.pageData.currentPage = newv - 1;
            }
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
