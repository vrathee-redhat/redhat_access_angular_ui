'use strict';

export default class ChangeOwnerModal {
    constructor($scope, $uibModalInstance, CaseService, strataService, AlertService, gettextCatalog, RHAUtils) {
        'ngInject';

        $scope.CaseService = CaseService;
        $scope.caseOwnerSso = "";
        $scope.RHAUtils = RHAUtils;
        $scope.confirm = () => {
            if (RHAUtils.isNotEmpty($scope.caseOwnerSso)) {
                let promise = strataService.cases.owner.update(CaseService.kase.case_number,$scope.caseOwnerSso);
                promise.then((response) => {
                    AlertService.addSuccessMessage(gettextCatalog.getString('Case  {{caseNumber}} owner successfully changed.', {caseNumber: CaseService.kase.case_number}));
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
