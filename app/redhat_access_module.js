angular.module('RedhatAccess', [
  'ngSanitize',
  'ui.select',
  'RedhatAccess.header',
  'RedhatAccess.template',
  'RedhatAccess.cases',
  'RedhatAccess.security',
  'RedhatAccess.search',
  'RedhatAccess.logViewer',
  'RedhatAccess.ui-utils'
])
.config(['$provide', 'uiSelectConfig',
  function ($provide, uiSelectConfig) {
    $provide.value('SECURITY_CONFIG', {displayLoginStatus:true,autoCheckLogin:true});
    uiSelectConfig.theme = 'bootstrap';
  }
])
.run(['TITLE_VIEW_CONFIG', '$http', 'securityService', 'gettextCatalog',
  function (TITLE_VIEW_CONFIG, $http, securityService, gettextCatalog) {
    TITLE_VIEW_CONFIG.show = true;
    securityService.validateLogin(false).then(
      function (authedUser) {
        console.log("logged in user is " + authedUser)
      },
      function (error) {
        console.log("Unable to get user credentials");
      });
    //gettextCatalog.currentLanguage = 'fr';
    //gettextCatalog.debug = true;
  }
]);

//Define dummy RedhatAccess.template module - not needed in productions since its
//generated as part of build
angular.module('RedhatAccess.template', []);
