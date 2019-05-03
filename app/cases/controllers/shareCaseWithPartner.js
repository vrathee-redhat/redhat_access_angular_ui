'use strict';
import { getTnCUrl, baseTnCUrl } from '../../shared/TnC';
import isEmpty from 'lodash/isEmpty';
import get from 'lodash/get';

export default class ShareCaseWithPartner {
    constructor($scope, CaseService, AlertService, CASE_EVENTS, gettextCatalog) {
        'ngInject';

        $scope.CaseService = CaseService;
        $scope.selectedPartners = [];

        this.removeQueryParams = () => {
            const url = window.location.href;
            const x = url.replace(/&?partnerAccountNumber=(\d+)/gi, '');
            const y = x.replace(/&?decision-\d+=\w+/gi, '');
            const z = y.replace(/&ackID=(\d+)/gi, '');
            window.location.replace(z);
        }

        this.removeRejectQueryParams = () => {
            const url = window.location.href;
            const x = url.replace(/\??rejectedTnC=\w+/gi, '');
            window.location.replace(x);
        }

        this.handleTnCQueryParams = async () => {
            const rejectedTnC = (/rejectedTnC=\w+/gi).exec(window.location.href.toString());
            if (rejectedTnC) {
                AlertService.addDangerMessage(`Case cannot be shared untill terms and conditions are accepted`);
                this.removeRejectQueryParams();
            } else {
                const partnerAccountNumber = get((/partnerAccountNumber=(\d+)/gi).exec(window.location.href.toString()), [1]);
                const decisionAccepted = (/decision-\d+=accepted/gi).exec(window.location.href.toString());
                const ackID = get((/ackID=(\d+)/gi).exec(window.location.href.toString()), [1]);
                if (partnerAccountNumber && decisionAccepted && ackID) {
                    await CaseService.savePartnerCaseAccess(CaseService.kase.case_number, partnerAccountNumber, ackID);
                    this.removeQueryParams();
                }
            }
        }

        const init = async () => {
            if((document.referrer || '').startsWith(baseTnCUrl())) {
                await this.handleTnCQueryParams();
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
