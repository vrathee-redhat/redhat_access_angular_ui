'use strict';

export default ($stateProvider) => {
    'ngInject';
    
    $stateProvider.state('logviewer', {
        url: '/logviewer',
        template: require('./views/log_viewer.jade')
    });
}
