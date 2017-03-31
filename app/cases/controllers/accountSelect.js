'use strict';

export default class AccountSelect {
    constructor($scope, strataService, AlertService, CaseService, RHAUtils, gettextCatalog, ProductsService, securityService, $state) {
        'ngInject';

        $scope.CaseService = CaseService;
        $scope.securityService = securityService;
        $scope.bookmarkAccountUrl = $state.href('accountBookmark');
        $scope.selectUserAccount = function () {
            $scope.loadingAccountNumber = true;
            strataService.accounts.list().then(function (response) {
                $scope.loadingAccountNumber = false;
                $scope.populateAccountSpecificFields(response);
            }, function (error) {
                $scope.loadingAccountNumber = false;
                AlertService.addStrataErrorMessage(error);
            });
        };
        $scope.alertInstance = null;
        $scope.populateAccountSpecificFields = function (accountNumber) {
            CaseService.account.number = accountNumber;
            if (RHAUtils.isNotEmpty(CaseService.account.number)) {
                var promise = null;
                strataService.accounts.get(CaseService.account.number).then(function (account) {
                    CaseService.defineAccount(account);
                    if (RHAUtils.isNotEmpty($scope.alertInstance)) {
                        AlertService.removeAlert($scope.alertInstance);
                    }
                    promise = CaseService.populateUsers();
                    promise.then(angular.bind(this, function (users) {
                        if (RHAUtils.isEmpty(CaseService.owner)) {
                            ProductsService.clear();
                            CaseService.clearProdVersionFromLS();
                        } else {
                            CaseService.onOwnerSelectChanged();
                        }
                        CaseService.validateNewCase();
                    }));

                }, function () {
                    if (RHAUtils.isNotEmpty($scope.alertInstance)) {
                        AlertService.removeAlert($scope.alertInstance);
                    }
                    $scope.alertInstance = AlertService.addWarningMessage(gettextCatalog.getString('Account not found.'));
                    CaseService.users = [];
                    ProductsService.clear();
                    CaseService.clearProdVersionFromLS();
                    CaseService.validateNewCase();
                });
            }
        };
    }
}
