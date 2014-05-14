'use strict';
/*jshint unused:vars */

angular.module('RedhatAccess.cases')
  .directive('rhaCaseDescription', function() {
    return {
      templateUrl: 'cases/views/descriptionSection.html',
      restrict: 'EA',
      controller: 'DescriptionSection',
      link: function postLink(scope, element, attrs) {}
    };
  });