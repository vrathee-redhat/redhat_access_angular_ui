'use strict';

export default class EscalationRequestService {
    constructor(strataService, AlertService, ESCALATION_TYPE, HeaderService, gettextCatalog) {
        'ngInject';

        this.accountNumber = '';
        this.caseNumber = '';
        this.alreadyEscalated = false;
        this.requestorName = '';
        this.requestorEmail = '';
        this.requestorPhone = '';
        this.customerName = '';
        this.customerEmail = '';
        this.customerPhone = '';
        this.geo = '';
        this.severity = 3;
        this.expectations = '';
        this.issueDescription = '';
        this.subject = '';
        this.subjectText = '';
        this.notPartnerLogin = false;

        this.clearEscalationFields = function () {
            this.accountNumber = '';
            this.caseNumber = '';
            this.alreadyEscalated = false;
            this.requestorName = '';
            this.requestorEmail = '';
            this.requestorPhone = '';
            this.customerName = '';
            this.customerEmail = '';
            this.customerPhone = '';
            this.geo = '';
            this.severity = 3;
            this.expectations = '';
            this.issueDescription = '';
            this.subject = '';
            this.subjectText = '';
        };

        this.sendEscalationRequest = function (recordType) {
            var subject = '';
            var escalationSource = '';
            if (recordType === ESCALATION_TYPE.partner) {
                subject = 'Partner Escalation through Portal Case Management';
                escalationSource = 'Partner Escalation';
            } else {
                subject = 'Ice Escalation through Portal Case Management';
                escalationSource = 'Sales/ICE Escalation';
            }
            var escalationJSON = {
                'record_type': 'Active Customer Escalation',
                'subject': subject,
                'escalationSource': escalationSource,
                'status': 'New'
            };
            var isObjectNothing = function (object) {
                if (object === '' || object === undefined || object === null) {
                    return true;
                } else {
                    return false;
                }
            };

            if (!isObjectNothing(this.accountNumber)) {
                escalationJSON.account_number = this.accountNumber;
            }
            if (!isObjectNothing(this.caseNumber)) {
                escalationJSON.case_number = this.caseNumber;
            }
            if (!isObjectNothing(this.customerName)) {
                escalationJSON.customer_name = this.customerName;
            }
            if (!isObjectNothing(this.customerEmail)) {
                escalationJSON.customer_email = this.customerEmail;
            }
            if (!isObjectNothing(this.customerPhone)) {
                escalationJSON.customer_phone = this.customerPhone;
            }
            if (!isObjectNothing(this.requestorName)) {
                escalationJSON.requestor = this.requestorName;
            }
            if (!isObjectNothing(this.requestorEmail)) {
                escalationJSON.requestor_email = this.requestorEmail;
            }
            if (!isObjectNothing(this.requestorPhone)) {
                escalationJSON.requestor_phone = this.requestorPhone;
            }
            if (!isObjectNothing(this.subject)) {
                if (this.subject !== 'Other') {
                    escalationJSON.issue_description = this.subject + '\n\n';
                } else {
                    escalationJSON.issue_description = this.subject + ' - ' + this.subjectText + '\n\n';
                }
            }
            if (!isObjectNothing(this.issueDescription)) {
                escalationJSON.issue_description = (escalationJSON.issue_description || '').concat(this.issueDescription);
            }
            if (!isObjectNothing(this.alreadyEscalated)) {
                escalationJSON.already_escalated = this.alreadyEscalated;
            }
            if (!isObjectNothing(this.geo)) {
                escalationJSON.geo = this.geo;
            }
            if (!isObjectNothing(this.severity)) {
                escalationJSON.severity = this.severity;
            }
            if (!isObjectNothing(this.expectations)) {
                escalationJSON.expectations = this.expectations;
            }
            if (recordType === ESCALATION_TYPE.partner) {
                AlertService.clearAlerts();
                AlertService.addSuccessMessage(gettextCatalog.getString('Creating Partner Escalation request .....'));
            } else {
                AlertService.clearAlerts();
                AlertService.addSuccessMessage(gettextCatalog.getString('Creating Ice Escalation request .....'));
            }
            const promise = strataService.escalationRequest.create(escalationJSON)
            promise.then((escalationNum) => {
                AlertService.clearAlerts();
                if (escalationNum !== undefined) {
                    if (recordType === ESCALATION_TYPE.partner) {
                        AlertService.addSuccessMessage(gettextCatalog.getString('Your Partner Escalation request has been sent successfully'));
                    } else {
                        AlertService.addSuccessMessage(gettextCatalog.getString('Your Ice Escalation request has been sent successfully'));
                    }
                    this.clearEscalationFields();
                }
            }, (error) => {
                if (error.xhr.status === 403) {
                    AlertService.clearAlerts();
                    HeaderService.showPartnerEscalationError = true;
                } else {
                    AlertService.addStrataErrorMessage(error);
                }
            });
            return promise;
        };
    }
}
