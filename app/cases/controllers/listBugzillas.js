'use strict';

angular.module('RedhatAccess.cases')
.controller('ListBugzillas', [
  '$scope',
  'CaseService',
  function (
	  	$scope,
	    CaseService) {

  	$scope.CaseService = CaseService;
  }
    
]);