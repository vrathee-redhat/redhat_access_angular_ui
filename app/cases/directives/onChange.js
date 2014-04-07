'use strict';

angular.module('RedhatAccessCases')
.directive('rhaOnChange', function () {
  return {
    restrict: "A",
    link: function (scope, element, attrs) {
      element.bind('change', element.scope()[attrs.rhaOnChange]);
    }
  };
});