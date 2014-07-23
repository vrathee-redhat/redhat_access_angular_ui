'use strict';

angular.module('RedhatAccess.cases')
.directive('rhaExportcsvbutton', function () {
  return {
    templateUrl: 'cases/views/exportCSVButton.html',
    restrict: 'EA',
    controller: 'ExportCSVButton'
  };
});
