'use strict';

angular.module('RedhatAccess.cases')
.directive('rhaAccountSelect', function () {
  return {
    templateUrl: 'cases/views/accountSelect.html',
    restrict: 'E',
    controller: 'AccountSelect'
  };
});
