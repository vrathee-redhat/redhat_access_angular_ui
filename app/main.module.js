'use strict';

if (ENVIRONMENT === 'gs4') {
    require('bootstrap/dist/js/bootstrap');
    require('bootstrap/dist/css/bootstrap.css');
}

require("angular");
require('angular-gettext');
require('./localFile');
require('angular-resource');
require('angular-sanitize');
require('angular-animate');
require('angular-route');
require('angular-md5');
require('ng-infinite-scroll');
require('angular-treeview/angular.treeview');
require('angular-ui-router');
require('angular-ui-bootstrap/dist/ui-bootstrap-tpls.js');
require('ng-table/ng-table');
require('angular-cache');
require("angular-chosen-localytics/dist/angular-chosen.js");
require("chosen-npm/public/chosen.jquery.js");

window.moment = require('moment');
require('moment-timezone');

let Promise = require('bluebird');
window.Promise = Promise;
let strata = require('stratajs/strata.js');
window.strata = strata;

if (ENVIRONMENT === 'test') {
    require('angular-mocks');
} else {
    require('./assets/sass/main.scss');
}



import mainRouting from './main.routing'

// Import the common modules
require('redhat_access_pcm_ascension_common/app/common/main.module');

// Import the various local modules
require('./cases/cases.module');
require('./search/search.module');
require('./log_viewer/log_viewer.module');
require('./escalation/escalation.module');

//Define dummy RedhatAccess.template module - not needed in productions since its
//generated as part of build
angular.module('RedhatAccess.template', []);

const app = angular.module('RedhatAccess', [
    'ngSanitize',
    'ngTable',
    'angular-cache',
    'localytics.directives',
    'RedhatAccess.header',
    'RedhatAccess.template',
    'RedhatAccess.security',
    'RedhatAccess.ui-utils',
    'RedhatAccess.cases',
    'RedhatAccess.search',
    'RedhatAccess.logViewer'
]);

// Load in the various translations see: https://github.com/princed/angular-gettext-loader
if (ENVIRONMENT !== 'test') {
    require('./i18n/template-de.po');
    require('./i18n/template-es.po');
    require('./i18n/template-fr.po');
    require('./i18n/template-it.po');
    require('./i18n/template-jp.po');
    require('./i18n/template-ko.po');
    require('./i18n/template-pt.po');
    require('./i18n/template-zh.po');
    require('./i18n/template_ru.po');
}

// Routing
app.config(mainRouting);


function getCookieValue(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) != -1) return c.substring(name.length,c.length);
    }
    return "";
}

if (ENVIRONMENT === 'gs4') {
    const host = window.location.host;
    strata.setStrataHostname('https://access.us.stage.redhat.com');
    strata.setRedhatClientID("secure_case_management_1.0");
    $.support.cors = true;

    angular.module('RedhatAccess.cases').run(
        function (COMMON_CONFIG, CHAT_SUPPORT, EDIT_CASE_CONFIG, NEW_CASE_CONFIG, SECURITY_CONFIG, securityService, gettextCatalog){
            'ngInject';

            COMMON_CONFIG.isGS4 = true;
            COMMON_CONFIG.showTitle = false;
            COMMON_CONFIG.doSfdcHealthCheck = false;
            COMMON_CONFIG.sfdcIsHealthy = true;
            COMMON_CONFIG.sfdcOutageMessage = '<ul class="message"><li class="alertSystem">There is currently a scheduled outage to the Case Management areas of the Red Hat Customer Portal.  The case management functions are expected to be unavailable for 9 hours and should return around 9am ET (UTC -0500).  The outage is due to case management infrastructure maintenance.<br/><br/>During the planned outage window, users will not be able to perform any case-related actions, including creating new support cases and updating existing support cases. Other areas of the Customer Portal, including the Knowledgebase and product documentation, will continue to be available.<br/><br/>If you require assistance with your Red Hat Product during the scheduled maintenance outage, please <a target="_blank" href="https://access.redhat.com/support/contact/technicalSupport/">contact Red Hat support</a><br/><br/>We apologize for any inconvenience caused by this scheduled maintenance.</li></ul>';
            SECURITY_CONFIG.autoCheckLogin = false;
            SECURITY_CONFIG.displayLoginStatus = true;
            securityService.loginURL = host.replace('us.', '') + '/login?redirectTo=' + window.location.href;
            securityService.logoutURL = host.replace('us.', '') + '/logout';
            NEW_CASE_CONFIG.showServerSideAttachments = false;
            EDIT_CASE_CONFIG.showServerSideAttachments = false;
            gettextCatalog.currentLanguage = getCookieValue('rh_locale');
            CHAT_SUPPORT.enableChat = false;
            NEW_CASE_CONFIG.isPCM = false;
            // NEW_CASE_CONFIG.productSortListFile = 'productSortList.txt';
            EDIT_CASE_CONFIG.isPCM = false;
            NEW_CASE_CONFIG.showRecommendations = false;
            NEW_CASE_CONFIG.showAttachments = false;
            EDIT_CASE_CONFIG.showBugzillas = false;
            EDIT_CASE_CONFIG.showAttachments = false;
            EDIT_CASE_CONFIG.showRecommendations = false;
            EDIT_CASE_CONFIG.showEmailNotifications = false;
            securityService.validateLogin(false);
        }
    );

    angular.element(document).ready(function() {
        window.angular.bootstrap(document, ['RedhatAccess.cases']);
    });

} else if (ENVIRONMENT !== 'test') {
    const host = window.location.host;
    const redirectURL = `${window.location.protocol}//${host}/login?redirectTo=${document.URL}`;

    window.strata.setStrataHostname('https://' + host);
    // TODO removed TITLE_VIEW_CONFIG / TITLE_VIEW_CONFIG.show = true;  It doesn't appear to be read in the code anywhere
    angular.module('RedhatAccess.cases').run(
        function ($rootScope, COMMON_CONFIG, CHAT_SUPPORT, EDIT_CASE_CONFIG, NEW_CASE_CONFIG, SECURITY_CONFIG, AUTH_EVENTS, securityService, gettextCatalog) {
            'ngInject';

            COMMON_CONFIG.showTitle = true;
            SECURITY_CONFIG.autoCheckLogin = false;
            SECURITY_CONFIG.displayLoginStatus = false;
            NEW_CASE_CONFIG.showServerSideAttachments = false;
            EDIT_CASE_CONFIG.showServerSideAttachments = false;
            gettextCatalog.currentLanguage = getCookieValue('rh_locale');
            CHAT_SUPPORT.enableChat = true;
            NEW_CASE_CONFIG.isPCM = true;
            EDIT_CASE_CONFIG.isPCM = true;

            CHAT_SUPPORT.chatButtonToken = '573A0000000GmiP';
            CHAT_SUPPORT.chatLiveAgentUrlPrefix = 'https://d.la8cs.salesforceliveagent.com/chat';
            CHAT_SUPPORT.chatInitHashOne = '572A0000000GmiP';
            CHAT_SUPPORT.chatInitHashTwo = '00DK000000W3mDA';
            CHAT_SUPPORT.chatIframeHackUrlPrefix = 'https://rogsstest.force.com/chatHidden';
            if (host !== 'access.redhat.com') {
                CHAT_SUPPORT.chatLiveAgentUrlPrefix = 'https://d.la6cs.salesforceliveagent.com/chat';
                CHAT_SUPPORT.chatIframeHackUrlPrefix = 'https://qa-rogsstest.cs10.force.com/chatHidden';
            }
            securityService.validateLogin(false).then(function (authedUser) {
                var account = securityService.loginStatus.account;
                if (account !== undefined && account.is_secured_support !== undefined && account.is_secured_support === true) {
                    strata.setRedhatClientID("secure_case_management_1.0");
                    strata.setStrataHostname('https://' + host.replace('access.', 'access.us.'));
                    NEW_CASE_CONFIG.showRecommendations = false;
                    NEW_CASE_CONFIG.showAttachments = false;
                    EDIT_CASE_CONFIG.showBugzillas = false;
                    EDIT_CASE_CONFIG.showAttachments = false;
                    EDIT_CASE_CONFIG.showRecommendations = false;
                    EDIT_CASE_CONFIG.showEmailNotifications = false;
                    CHAT_SUPPORT.enableChat = false;
                    COMMON_CONFIG.isGS4 = true;
                    $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
                }
            }, function (error) {
                window.location.replace(redirectURL);
            });
        }
    );
}

if (ENVIRONMENT !== 'gs4') {
    // Bootstrap angular app
    angular.bootstrap(document, ['RedhatAccess']);
    // Fade in main element
    $('#pcm').fadeIn();
}

export default app.name;
