'use strict';
/*jshint unused:vars */

angular.module('RedhatAccess.cases')
.directive('rhaChatButton', function () {
  return {
    templateUrl: 'cases/views/chatButton.html',
    restrict: 'E',
    controller: 'ChatButton'
  };
});
