'use strict';

angular.module('RedhatAccess.cases')
.directive('rhaListbugzillas', function () {
  return {
    templateUrl: 'cases/views/listBugzillas.html',
    restrict: 'EA',
    controller: 'ListBugzillas',
    scope: {
      loading: '='
    },
    link: function postLink(scope, element, attrs) {
    }
  };
});