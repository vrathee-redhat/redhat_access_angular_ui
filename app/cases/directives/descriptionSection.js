'use strict';

angular.module('RedhatAccessCases')
.directive('rhaCaseDescription', function () {
return {
  templateUrl: 'cases/views/descriptionSection.html',
  restrict: 'EA',
  link: function postLink(scope, element, attrs) {
  }
};
});
