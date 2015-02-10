'use strict';
/*jshint camelcase: false */
angular.module('RedhatAccess.cases').service('EscalationRequestService', [
    'strataService',
    'AlertService',
    'RHAUtils',
    'ESCALATION_TYPE',
    'securityService',
    'translate',
    function (strataService, AlertService, RHAUtils, ESCALATION_TYPE, securityService, translate) {
	    
	    this.accountNumber = '';
	    this.caseNumber = '';
	    this.alreadyEscalated = false;
	    this.requestorEmail = '';
	    this.requestorPhone = '';
	    this.customerName = '';
	    this.customerEmail = '';
	    this.customerPhone = '';
	    this.geo = '';
	    this.expectations = '';
	    this.issueDescription = '';

	    this.clearEscalationFields = function() {
            this.accountNumber = '';
            this.caseNumber = '';
            this.alreadyEscalated = false;
            this.requestorEmail = '';
            this.requestorPhone = '';
            this.customerName = '';
            this.customerEmail = '';
            this.customerPhone = '';
            this.geo = '';
            this.expectations = '';
            this.issueDescription = '';
        };

	    this.sendEscalationRequest = function() {
	    	var escalationJSON = {
	    		'record_type': ESCALATION_TYPE.partner,
                'subject': 'Partner Escalation through Portal Case Management'
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
            if (!isObjectNothing(this.requestorEmail)) {
                escalationJSON.requestor_email = this.requestorEmail;
            }
            if (!isObjectNothing(this.requestorPhone)) {
                escalationJSON.requestor_phone = this.requestorPhone;
            }
            if (!isObjectNothing(this.issueDescription)) {
                escalationJSON.issue_description = this.issueDescription;
            }
            if (!isObjectNothing(this.alreadyEscalated)) {
                escalationJSON.already_escalated = this.alreadyEscalated;
            }
            if (!isObjectNothing(this.geo)) {
                escalationJSON.geo = this.geo;
            }
            if (!isObjectNothing(this.expectations)) {
                escalationJSON.expectations = this.expectations;
            }

	    	strataService.escalationRequest.create(escalationJSON).then(angular.bind(this,function (escalationNum) {
                AlertService.clearAlerts();
                if (escalationNum !== undefined) {
                	AlertService.addSuccessMessage(translate('Your Partner Escalation request has been sent successfully'));
                	this.clearEscalationFields();
                }
            }, function (error) {
                AlertService.addStrataErrorMessage(error);
            }));
	    };
	}
]);