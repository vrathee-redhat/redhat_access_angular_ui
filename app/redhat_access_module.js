angular.module('RedhatAccess', [
  'ngSanitize',
  'RedhatAccess.header',
  'RedhatAccess.template',
  'RedhatAccess.cases',
  'RedhatAccess.security',
  'RedhatAccess.search',
  'RedhatAccess.logViewer',
  'RedhatAccess.tree-selector'
]).run(['TITLE_VIEW_CONFIG', '$http', 'securityService',
  function (TITLE_VIEW_CONFIG, $http, securityService) {
    TITLE_VIEW_CONFIG.show = true;
    securityService.validateLogin(false).then(
      function (authedUser) {
        console.log("logged in user is " + authedUser)
      },
      function (error) {
        console.log("Unable to get user credentials");
      });
  }
]);

//Define dummy RedhatAccess.template module - not needed in productions since its
//generated as part of build
angular.module('RedhatAccess.template', []);