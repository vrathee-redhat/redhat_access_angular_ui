'use strict';

angular.module('RedhatAccess.cases')
.directive('rhaEmailNotifySelect', function () {
  return {
    templateUrl: 'cases/views/emailNotifySelect.html',
    restrict: 'E',
    controller: 'EmailNotifySelect'
  };
});
