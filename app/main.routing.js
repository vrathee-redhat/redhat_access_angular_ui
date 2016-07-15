'use strict';

export default ($provide, $urlRouterProvider) => {
    'ngInject';
    
    $urlRouterProvider.otherwise('case/list');

    $provide.value('SECURITY_CONFIG', {
        displayLoginStatus: true,
        autoCheckLogin: true,
        forceLogin: false,
        loginURL: '',
        logoutURL: ''
    });
}
