'use strict';
/*jshint camelcase: false */
angular.module('RedhatAccess.ascension').service('CaseDetailsService', [
    'udsService',
    'AlertService',
    'RHAUtils',
    'securityService',
    'translate',
    function (udsService, AlertService, RHAUtils, ESCALATION_TYPE, securityService, translate) {
		this.caseDetailsLoading = false;
		this.kase = {};
		//TODO
		//Hard coded for now to build case overview capability, would be replaced by top cases query
		this.cases = ['01359622','01189381','00948138','01309616','00582443','01153706','00947587'];
		
		this.getCaseDetails = function(caseNumber) {
			this.caseDetailsLoading = true;
			udsService.kase.details.get(caseNumber).then(angular.bind(this, function (response) {
				this.kase = response;
				this.caseDetailsLoading = false;
			}), angular.bind(this, function (error) {
				AlertService.addStrataErrorMessage(error);
				this.caseDetailsLoading = false;
	        }));
		};

		this.getYourcases = function() {

		};
	}
]);
