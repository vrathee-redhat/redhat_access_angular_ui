'use strict';

export default class ChangeOwnerModal {
    constructor($scope, $uibModalInstance, CaseService, strataService, AlertService, gettextCatalog, RHAUtils) {
        'ngInject';

        $scope.CaseService = CaseService;
        $scope.caseOwner = {};
        $scope.RHAUtils = RHAUtils;
        $scope.confirm = () => {
            if (RHAUtils.isNotEmpty($scope.caseOwner.sso_username)) {
                let promise = strataService.cases.owner.update(CaseService.kase.case_number,$scope.caseOwner.sso_username);
                promise.then((response) => {
                    AlertService.addSuccessMessage(gettextCatalog.getString('Case  {{caseNumber}} owner successfully changed.', {caseNumber: CaseService.kase.case_number}));
                    CaseService.kase.owner = $scope.caseOwner.first_name+' '+$scope.caseOwner.last_name;
                    angular.copy(CaseService.kase, CaseService.prestineKase);
                    $uibModalInstance.close();
                }, (error) => {
                    AlertService.addStrataErrorMessage(error);
                });
            }
        };
        $scope.closeModal = () => {
            $uibModalInstance.close();
        };
    }
}
