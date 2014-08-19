'use strict';
/*global strata,$*/
/*jshint unused:vars */
/*jshint camelcase: false */
angular.module('RedhatAccess.security')
  .controller('SecurityController', ['$scope', '$rootScope', 'securityService', 'SECURITY_CONFIG',
    function ($scope, $rootScope, securityService, SECURITY_CONFIG) {
      $scope.securityService = securityService;
      if (SECURITY_CONFIG.autoCheckLogin) {
        securityService.validateLogin(SECURITY_CONFIG.forceLogin);
      }
      $scope.displayLoginStatus = function () {
        return SECURITY_CONFIG.displayLoginStatus;
      };
    }
  ])