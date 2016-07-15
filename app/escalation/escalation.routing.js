'use strict';

export default ($stateProvider) => {
    $stateProvider.state('partnerEscalation', {
        url: '/partnerEscalationRequest',
        controller: 'EscalationRequest',
        template: require('./views/partnerEscalation.jade')
    });
    $stateProvider.state('iceEscalation', {
        url: '/iceEscalationRequest',
        controller: 'EscalationRequest',
        template: require('./views/iceEscalation.jade')
    });
}
