'use strict';

angular.module('RedhatAccessCases')
.service('CaseListService', [
  function () {
    this.cases = [];

    this.defineCases = function(cases) {
      this.cases = cases;
    }
  }
]);
