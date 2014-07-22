'use strict';
/*jshint unused:vars */
angular.module('RedhatAccess.cases')
.directive('rhaGroupselect', function () {
  return {
    templateUrl: 'cases/views/groupSelect.html',
    restrict: 'EA',
    controller: 'GroupSelect',
    scope: {
      onchange: '&',
      showsearchoptions: '='
    }
  };
});
