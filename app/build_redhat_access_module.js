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
    'TITLE_VIEW_CONFIG',
    '$http',
    'securityService',
    'gettextCatalog',
    'CHAT_SUPPORT',
    function (TITLE_VIEW_CONFIG, $http, securityService, gettextCatalog, CHAT_SUPPORT) {
        TITLE_VIEW_CONFIG.show = true;
        CHAT_SUPPORT.enableChat = true;
        CHAT_SUPPORT.chatButtonToken = '573A0000000GmiP';
        CHAT_SUPPORT.chatLiveAgentUrlPrefix = 'https://d.la8cs.salesforceliveagent.com/chat';
        CHAT_SUPPORT.chatInitHashOne = '572A0000000GmiP';
        CHAT_SUPPORT.chatInitHashTwo = '00DK000000W3mDA';
        CHAT_SUPPORT.chatIframeHackUrlPrefix = 'https://rogsstest.force.com/chatHidden';
    }
]);