
'use strict';
/*jshint unused:vars */
angular.module('RedhatAccess.cases')
.directive('rhaCreategroupbutton', function () {
  return {
    templateUrl: 'cases/views/createGroupButton.html',
    restrict: 'EA',
    controller: 'CreateGroupButton'
  };
});
