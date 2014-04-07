angular.module('RedhatAccessCases', [
  'ui.router',
  'ui.bootstrap',
  'ngTable',
  'templates.app',
  'RedhatAccess.security'
])
.constant('STATUS', {
  open: 'open',
  closed: 'closed',
  both: 'both'
})
.config([
  '$stateProvider',
  function ($stateProvider) {
    $stateProvider.state('case', {
      url: '/case/{id:[0-9]{1,8}}',
      templateUrl: 'cases/views/details.html',
      controller: 'Details',
      resolve: {
        caseJSON: function(strataService, $stateParams) {
          return strataService.cases.get($stateParams.id);
        },
        accountJSON: function(strataService, caseJSON) {
          var accountNumber = caseJSON.account_number;

          if (angular.isString(accountNumber)) {
            return strataService.accounts.get(caseJSON.account_number);
          } else {
            return null;
          }
        },
        attachmentsJSON: function (strataService, $stateParams) {
          return strataService.cases.attachments.list($stateParams.id);
        },
        commentsJSON: function (strataService, $stateParams) {
          return strataService.cases.comments.get($stateParams.id);
        },
        caseTypesJSON: function (strataService) {
          return strataService.values.cases.types();
        },
        severitiesJSON: function (strataService) {
          return strataService.values.cases.severity();
        },
        groupsJSON: function(strataService) {
          return strataService.groups.list();
        },
        productsJSON: function(strataService) {
          return strataService.products.list();
        },
        statusesJSON: function (strataService) {
          return strataService.values.cases.status();
        }
      }
    });

    $stateProvider.state('new', {
      url: '/case/new',
      templateUrl: 'cases/views/new.html',
      controller: 'New',
      resolve: {
        productsJSON: function(strataService) {
          return strataService.products.list();
        },
        severityJSON: function (strataService) {
          return strataService.values.cases.severity();
        },
        groupsJSON: function(strataService) {
          return strataService.groups.list();
        }
      }
    });

    $stateProvider.state('list', {
      url: '/case/list',
      templateUrl: 'cases/views/list.html',
      controller: 'List',
      resolve: {
        casesJSON: function (strataService) {
          return strataService.cases.filter();
        },
        groupsJSON: function(strataService) {
          return strataService.groups.list();
        }
      }
    });
  }
])
.run([
  '$rootScope',
  'securityService',
  '$state',
  function (
    $rootScope,
    securityService,
    $state) {

    //TODO: find a better way to inject a loading message
    var showLoading = function() {
      if ($('#rha-loading').length === 0) {
        $('#rha-content').after('<h1 id="rha-loading" class="text-center">Loading...</h1>');
      }
      $('#rha-content').toggleClass('rha-hidden', true);
    };

    var hideLoading = function() {
      $('#rha-loading').remove();
      $('#rha-content').toggleClass('rha-hidden', false);
    };

    $rootScope.$on('$stateChangeSuccess',
      function(event, toState, toParams, fromState, fromParams) {
        hideLoading();
      }
    );

    $rootScope.$on('$stateChangeStart',
      function (event, toState, toParams, fromState, fromParams) {

        showLoading();

        if (!securityService.isLoggedIn) {
          event.preventDefault();

          strata.checkLogin(
            function (isLoggedIn, user) {

              if (!isLoggedIn) {
                securityService.login().then(
                  function (authedUser) {
                    if (authedUser) {
                      securityService.isLoggedIn = true;
                      $state.transitionTo(toState, toParams);
                    } else {
                      securityService.isLoggedIn = false;
                      console.log('Not logged in.');
                    }
                  });
              } else {
                securityService.isLoggedIn = true;
                $state.transitionTo(toState, toParams);
              }

            }
          );
        }
      }
    );

  }
]);