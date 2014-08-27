'use strict';
/*global angular*/
/*jshint unused:vars */
angular.module('RedhatAccess.cases')
.directive('rhaOwnerselect', function () {
  return {
    templateUrl: 'cases/views/ownerSelect.html',
    restrict: 'A',
    controller: 'OwnerSelect',
    scope: {
      onchange: '&'
    },
    link: function postLink(scope, element, attrs) {
        scope.$on('$destroy', function () {
            element.remove();
        });
    }
  };
});
