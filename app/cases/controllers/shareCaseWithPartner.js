'use strict';
import isEmpty from 'lodash/isEmpty';

export default class ShareCaseWithPartner {
    constructor($scope, CaseService, securityService, AlertService, strataService, CASE_EVENTS, $filter, RHAUtils, EDIT_CASE_CONFIG, gettextCatalog) {
        'ngInject';

        $scope.CaseService = CaseService;
        $scope.selectedPartners = [];
    
        const init = () => {
        };

        if (CaseService.caseDataReady) {
            init();
        }
        $scope.$on(CASE_EVENTS.received, () => {
            init();
        });

        $scope.$watch('selectedPartners', (partner) => {
            if(!isEmpty(partner)) {
                CaseService.savedPartners = [partner];
                $scope.selectedPartners = [];
            }
        })
    }
}
