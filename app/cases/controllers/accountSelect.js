'use strict';
angular.module('RedhatAccess.cases').controller('AccountSelect', [
    '$scope',
    'strataService',
    'AlertService',
    'CaseService',
    'RHAUtils',
    'translate',
    'ProductsService',
    function ($scope, strataService, AlertService, CaseService, RHAUtils, translate,ProductsService) {
        $scope.CaseService = CaseService;
        $scope.selectUserAccount = function () {
            $scope.loadingAccountNumber = true;
            strataService.accounts.list().then(function (response) {
                $scope.loadingAccountNumber = false;
                CaseService.account.number = response;
                $scope.populateAccountSpecificFields();
            }, function (error) {
                $scope.loadingAccountNumber = false;
                AlertService.addStrataErrorMessage(error);
            });
        };
        $scope.alertInstance = null;
        $scope.populateAccountSpecificFields = function () {
            if (RHAUtils.isNotEmpty(CaseService.account.number)) {
                var promise = null;
                strataService.accounts.get(CaseService.account.number).then(function () {
                    if (RHAUtils.isNotEmpty($scope.alertInstance)) {
                        AlertService.removeAlert($scope.alertInstance);
                    }
                    promise = CaseService.populateUsers();
                    promise.then(angular.bind(this, function (users)
                    {
                        if(RHAUtils.isEmpty(CaseService.owner)) {
                            ProductsService.clear();
                            CaseService.clearProdVersionFromLS();
                        }else{
                            CaseService.onOwnerSelectChanged();
                        }
                        CaseService.validateNewCase();
                    }));

                }, function () {
                    if (RHAUtils.isNotEmpty($scope.alertInstance)) {
                        AlertService.removeAlert($scope.alertInstance);
                    }
                    $scope.alertInstance = AlertService.addWarningMessage(translate('Account not found.'));
                    CaseService.users = [];
                    ProductsService.clear();
                    CaseService.clearProdVersionFromLS();
                    CaseService.validateNewCase();
                });
            }
        };
    }
]);
