'use strict';

angular.module('RedhatAccess.cases')
.directive('rhaCaseDetails', function () {
  return {
    templateUrl: 'cases/views/detailsSection.html',
    controller: 'DetailsSection',
    scope: {
      compact: '='
    },
    restrict: 'EA',
    link: function postLink(scope, element, attrs) {
    }
  };
});
