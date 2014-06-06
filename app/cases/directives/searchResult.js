'use strict';

angular.module('RedhatAccess.cases')
.directive('rhaCaseSearchResult', function () {
  return {
    templateUrl: 'cases/views/searchResult.html',
    restrict: 'E',
    scope: {
      theCase: '=case'
    }
  };
});
