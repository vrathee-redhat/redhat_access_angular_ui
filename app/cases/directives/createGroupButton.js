
'use strict';
/*jshint unused:vars */
angular.module('RedhatAccess.cases')
.directive('rhaCreateGroupButton', function () {
  return {
    templateUrl: 'cases/views/createGroupButton.html',
    restrict: 'E',
    controller: 'CreateGroupButton'
  };
});
