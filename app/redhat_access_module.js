angular.module('RedhatAccess', [
    'ngSanitize',
    'localytics.directives',
    'RedhatAccess.header',
    'RedhatAccess.template',
    'RedhatAccess.cases',
    'RedhatAccess.security',
    'RedhatAccess.search',
    'RedhatAccess.logViewer',
    'RedhatAccess.ui-utils'
]).config([
    '$provide',
    function ($provide) {
        $provide.value('SECURITY_CONFIG', {
            displayLoginStatus: true,
            autoCheckLogin: true,
            forceLogin: false,
            loginURL: '',
            logoutURL: ''
        });
    }
]).run([
    '$http',
    'securityService',
    'gettextCatalog',
    'CHAT_SUPPORT',
    function ($http, securityService, gettextCatalog, CHAT_SUPPORT) {
        CHAT_SUPPORT.chatButtonToken = '573A0000000GmiP';
        CHAT_SUPPORT.chatLiveAgentUrlPrefix = 'https://d.la8cs.salesforceliveagent.com/chat';
        CHAT_SUPPORT.chatInitHashOne = '572A0000000GmiP';
        CHAT_SUPPORT.chatInitHashTwo = '00DK000000W3mDA';
        CHAT_SUPPORT.chatIframeHackUrlPrefix = 'https://qa-rogsstest.cs9.force.com/chatHidden';
        //gettextCatalog.currentLanguage ='fr';
        //gettextCatalog.debug = true;
    }
]);
//Define dummy RedhatAccess.template module - not needed in productions since its
//generated as part of build
angular.module('RedhatAccess.template', []);