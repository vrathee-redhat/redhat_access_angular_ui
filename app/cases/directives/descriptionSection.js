'use strict';

angular.module('RedhatAccessCases')
.directive('rhaCaseDescription', function () {
return {
  templateUrl: 'cases/views/descriptionSection.html',
  restrict: 'EA',
  scope: {
    description: '=',
    creator: '='
  },
  link: function postLink(scope, element, attrs) {
  }
};
});
