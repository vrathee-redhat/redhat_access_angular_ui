'use strict';

angular.module('RedhatAccess.cases')
.directive('rhaExportCsvButton', function () {
  return {
    templateUrl: 'cases/views/exportCSVButton.html',
    restrict: 'E',
    controller: 'ExportCSVButton'
  };
});
