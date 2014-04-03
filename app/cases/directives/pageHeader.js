'use strict';

angular.module('RedhatAccessCases')
.directive('rhaPageHeader', function () {
  return {
    templateUrl: 'cases/views/pageHeader.html',
    restrict: 'EA',
    scope: {
      title: '=title'
    },
    link: function postLink(scope, element, attrs) {
    }
  };
});
