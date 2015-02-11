'use strict';
angular.module('RedhatAccess.escalation', [
    'ui.router',
    'ui.bootstrap',
    'localytics.directives',
    'ngTable',
    'RedhatAccess.template',
    'RedhatAccess.security',
    'RedhatAccess.search',
    'RedhatAccess.ui-utils',
    'RedhatAccess.common',
    'RedhatAccess.header'
]).config([
    '$stateProvider',
    function($stateProvider) {
        $stateProvider.state('partnerEscalation', {
            url: '/partnerEscalationRequest',
            controller: 'PartnerEscalation',
            templateUrl: 'escalation/views/partnerEscalationForm.html'
        });
    }
]).constant('ESCALATION_TYPE', {
    partner: 'Partner Escalation',
    sales: 'Sales Escalation'
});