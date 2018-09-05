'use strict';

// Import the routing
import escalationRouting from './escalation.routing'

const app = angular.module('RedhatAccess.escalation', [
    'RedhatAccess.template',
    'RedhatAccess.security',
    'RedhatAccess.ui-utils',
    'RedhatAccess.common',
    'RedhatAccess.header'
]);

// Routing
app.config(escalationRouting);

// Constants
import ESCALATION_TYPE from './constants/escalationType'
import ESCALATION_STATUS from './constants/escalationStatus'
app.constant('ESCALATION_TYPE', ESCALATION_TYPE);
app.constant('ESCALATION_STATUS', ESCALATION_STATUS);

// Controllers
import EscalationRequest from './controllers/escalationRequest'
app.controller('EscalationRequest', EscalationRequest);

// Services
import EscalationRequestService from './services/escalationRequestService'
app.service('EscalationRequestService', EscalationRequestService);

export default app.name
