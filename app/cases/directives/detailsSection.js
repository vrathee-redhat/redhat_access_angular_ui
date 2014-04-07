'use strict';

angular.module('RedhatAccessCases')
.directive('rhaCaseDetails', function () {
  return {
    templateUrl: 'cases/views/detailsSection.html',
    controller: 'DetailsSection',
    scope: {
      compact: '=',
      casejson: '='
    },
    restrict: 'EA',
    link: function postLink(scope, element, attrs) {
    }
  };
});
