'use strict';
angular.module('RedhatAccess.cases', [
  'ui.router',
  'ui.bootstrap',
  'ngTable',
  'RedhatAccess.template',
  'RedhatAccess.security',
  'RedhatAccess.search',
  'RedhatAccess.ui-utils',
  'RedhatAccess.header'
])
.constant('STATUS', {
  open: 'open',
  closed: 'closed',
  both: 'both'
})
.value('NEW_DEFAULTS', {
  'product': '',
  'version': ''
})
.value('NEW_CASE_CONFIG', {
  'showRecommendations': true,
  'showAttachments': true
})
.value('EDIT_CASE_CONFIG', {
  'showDetails': true,
  'showDescription': true,
  'showBugzillas': true,
  'showAttachments': true,
  'showRecommendations': true,
  'showComments': true
})
.config([
  '$stateProvider',
  function ($stateProvider) {

    $stateProvider.state('compact', {
      url: '/case/compact?sessionId',
      templateUrl: 'cases/views/compact.html'
    });

    $stateProvider.state('compact.edit', {
      url: '/{id:[0-9]{1,8}}',
      templateUrl: 'cases/views/compactEdit.html',
      controller: 'CompactEdit'
    });

    $stateProvider.state('edit', {
      url: '/case/{id:[0-9]{1,8}}',
      templateUrl: 'cases/views/edit.html',
      controller: 'Edit'
    });

    $stateProvider.state('new', {
      url: '/case/new',
      templateUrl: 'cases/views/new.html',
      controller: 'New'
    });

    $stateProvider.state('list', {
      url: '/case/list',
      templateUrl: 'cases/views/list.html',
      controller: 'List'
    });

    $stateProvider.state('searchCases', {
      url: '/case/search',
      templateUrl: 'cases/views/search.html',
      controller: 'Search'
    });

    $stateProvider.state('group', {
      url: '/case/group',
      controller: 'Group',
      templateUrl: 'cases/views/group.html'
    });
  }
]);
