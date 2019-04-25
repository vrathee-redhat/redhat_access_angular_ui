'use strict';
import { getTnCUrl } from '../../shared/TnC';
import isEmpty from 'lodash/isEmpty';
import get from 'lodash/get';
import hydrajs from '../../shared/hydrajs';
export default class ShareCaseWithPartner {
    constructor($scope, CaseService, AlertService, CASE_EVENTS, gettextCatalog) {
        'ngInject';

        $scope.CaseService = CaseService;
        $scope.selectedPartners = [];

        this.removeQueryParams = () => {
            // Removing QP after successfully consuming these params to get clean slate,
            // so now if user hits refresh button, it will not start "Sharing Case with partner" Patch request. 
            const url = window.location.href;
            const x = url.replace(/&?partnerAccountNumber=(\d+)/gi, '');
            const y = x.replace(/&?decision-\d+=\w+/gi, '');
            const z = y.replace(/&ackID=(\d+)/gi, '');
            window.location.replace(z);
        }

        const init = async () => {
            const partnerAccountNumber = get((/partnerAccountNumber=(\d+)/gi).exec(window.location.href.toString()), [1]);
            const decisionAccepted = (/decision-\d+=accepted/gi).exec(window.location.href.toString());
            const ackID = get((/ackID=(\d+)/gi).exec(window.location.href.toString()), [1]);
            if(partnerAccountNumber && decisionAccepted && ackID) {
                var alert = AlertService.addWarningMessage(gettextCatalog.getString(`Sharing Case with ${partnerAccountNumber}`));
                CaseService.sharingCaseWithPartner = true;
                const body = {
                    access: { permission: 'Write', accountNumber: partnerAccountNumber },
                    confirmationNumber: ackID
                }
                try {
                    await hydrajs.kase.access.patchCaseAccess(CaseService.kase.case_number, body);
                    this.removeQueryParams();
                } catch (e) {
                    AlertService.addDangerMessage(e.message);
                }
                CaseService.sharingCaseWithPartner = false;
                AlertService.removeAlert(alert);
            }
            await CaseService.populatePartners(CaseService.kase.case_number, CaseService.kase.account_number);
        };

        if (CaseService.caseDataReady) {
            init();
        }
        $scope.$on(CASE_EVENTS.received, () => {
            init();
        });

        $scope.$watch('selectedPartnersInput', (partner) => {
            if(!isEmpty(partner)) {
                CaseService.TnCUrl = getTnCUrl(get(partner, 'accountNumber'));
                $scope.selectedPartners = [partner];
                $scope.selectedPartnersInput = '';
            }
        })
    }
}
