'use strict';

angular.module('RedhatAccess.cases')
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
