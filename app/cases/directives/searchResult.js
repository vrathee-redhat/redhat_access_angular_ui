'use strict';

angular.module('RedhatAccess.cases')
.directive('rhaCasesearchresult', function () {
  return {
    templateUrl: 'cases/views/searchResult.html',
    restrict: 'EA',
    scope: {
      theCase: '=case'
    }
  };
});
