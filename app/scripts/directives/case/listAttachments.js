'use strict';

angular.module('RedhatAccessCases')
.directive('rhaListAttachments', function () {
  return {
    templateUrl: 'views/case/listAttachments.html',
    restrict: 'EA',
    link: function postLink(scope, element, attrs) {
    }
  };
});
