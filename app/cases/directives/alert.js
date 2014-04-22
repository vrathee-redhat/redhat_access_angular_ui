'use strict';

angular.module('RedhatAccess.cases')
.directive('rhaAlert', function () {
  return {
    templateUrl: 'cases/views/alert.html',
    restrict: 'E',
    controller: 'AlertController',
    link: function postLink(scope, element, attrs) {
    }
  };
});
