'use strict';

angular.module('RedhatAccess.cases')
.directive('rhaCaseRecommendations', function () {
  return {
    templateUrl: 'cases/views/recommendationsSection.html',
    restrict: 'EA',
    controller: 'RecommendationsSection',
    link: function postLink(scope, element, attrs) {
    }
  };
});
