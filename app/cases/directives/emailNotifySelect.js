'use strict';

angular.module('RedhatAccess.cases')
.directive('rhaEmailnotifyselect', function () {
  return {
    templateUrl: 'cases/views/emailNotifySelect.html',
    restrict: 'A',
    controller: 'EmailNotifySelect'
  };
});
