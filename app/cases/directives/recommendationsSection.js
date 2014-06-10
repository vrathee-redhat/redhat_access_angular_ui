'use strict';
/*jshint unused:vars */

angular.module('RedhatAccess.cases')
.directive('rhaCaseRecommendations', function () {
  return {
    templateUrl: 'cases/views/recommendationsSection.html',
    restrict: 'EA',
    controller: 'RecommendationsSection',
    scope: {
      loading: '='
    },
    link: function postLink(scope, element, attrs) {
    }
  };
});
