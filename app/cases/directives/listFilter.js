'use strict';

angular.module('RedhatAccessCases')
.directive('rhaListFilter', function () {
  return {
    templateUrl: 'cases/views/listFilter.html',
    restrict: 'EA',
    controller: 'ListFilter',
    scope: {
      prefilter: '=',
      postfilter: '='
    },
    link: function postLink(scope, element, attrs) {
    }
  };
});
