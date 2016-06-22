'use strict';
angular.module('RedhatAccess.cases', [
    'ui.router',
    'ngAnimate',
    'ui.bootstrap',
    'localytics.directives',
    'ngTable',
    'angular-md5',
    'infinite-scroll',
    'RedhatAccess.template',
    'RedhatAccess.security',
    'RedhatAccess.search',
    'RedhatAccess.ui-utils',
    'RedhatAccess.common',
    'RedhatAccess.header'
]).constant('CASE_EVENTS', {
    received: 'case-received',
    searchSubmit: 'search-submit',
    searchBoxChange: 'search-box-change',
    productSelectChange: 'product-select-change',
    ownerChange: 'owner-change',
    caseStatusChanged: 'case-status-change',
    caseSeverityChanged: 'case-severity-change',
    caseClose: 'case-close',
    focusSearchInput: 'focus-search-input'
}).constant('ACCOUNT_EVENTS', {
    bookmarkedAccountsFetched: 'bookmarked-accounts-fetched'
}).constant('CHAT_SUPPORT', {
    enableChat: false,
    chatButtonToken: '573A0000000GmiP',
    chatLiveAgentUrlPrefix: 'https://d.la1w1.salesforceliveagent.com/chat',
    chatInitHashOne: '572A0000000GmiP',
    chatInitHashTwo: '00DA0000000HxWH',
    chatIframeHackUrlPrefix: 'https://rogsstest.secure.force.com/chatHidden'
}).constant('STATUS', {
    open: 'open',
    closed: 'closed',
    both: 'both'
}).value('NEW_DEFAULTS', {
    'product': '',
    'version': ''
}).value('GLOBAL_CASE_CONFIG', {
    'showRecommendations': true,
    'showAttachments': true
}).value('NEW_CASE_CONFIG', {
    'showRecommendations': true,
    'showAttachments': true,
    'showServerSideAttachments': true,
    'productSortListFile': '/productSortList.txt',
    'isPCM': false
}).value('EDIT_CASE_CONFIG', {
    'showDetails': true,
    'showDescription': true,
    'showBugzillas': true,
    'showAttachments': true,
    'showRecommendations': true,
    'showComments': true,
    'showServerSideAttachments': true,
    'showEmailNotifications': true,
    'isPCM': false
}).config([
    '$stateProvider',
    '$provide',
    function($stateProvider, $provide) {
        $stateProvider.state('edit', {
            url: '/case/{id:[0-9]{1,8}}?commentId',
            templateUrl: 'cases/views/edit.html',
            controller: 'Edit',
            reloadOnSearch: false
        });
        $stateProvider.state('new', {
            url: '/case/new?abtest&product&version',
            templateUrl: 'cases/views/new.html',
            controller: 'New',
            reloadOnSearch: true
        });
        $stateProvider.state('list', {
            url: '/case/list',
            templateUrl: 'cases/views/list.html',
            controller: 'List'
        });
        $stateProvider.state('group', {
            url: '/case/group',
            controller: 'ManageGroups',
            templateUrl: 'cases/views/manageGroups.html'
        });
        $stateProvider.state('defaultGroup', {
            url: '/case/group/default',
            controller: 'DefaultGroup',
            templateUrl: 'cases/views/defaultGroup.html'
        });
        $stateProvider.state('editGroup', {
            url: '/case/group/{groupNumber}',
            controller: 'EditGroup',
            templateUrl: 'cases/views/editGroup.html'
        });
        $stateProvider.state('advancedSearch', {
            url: '/case/search',
            controller: 'AdvancedSearchController',
            templateUrl: 'cases/views/advancedSearch.html'
        });
        $stateProvider.state('accountBookmark', {
            url: '/account/bookmark',
            controller: 'AccountBookmarkHome',
            templateUrl: 'cases/views/accountBookmarkHome.html'
        });
        $stateProvider.state('404', {
            url: '/404',
            templateUrl: 'cases/views/404.html'
        });
        $stateProvider.state('403', {
            url: '/403',
            templateUrl: 'cases/views/403.html'
        });

        if(window.location.host !== 'access.redhat.com') {
            $provide.decorator("$exceptionHandler", ['$delegate', function($delegate) {
                return function(exception, cause) {
                    $delegate(exception, cause);
                    if(window.errors == null) window.errors = [];
                    window.errors.push(exception);
                };
            }]);
        }

    }
]);
