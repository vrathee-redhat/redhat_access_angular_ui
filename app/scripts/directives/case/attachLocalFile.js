'use strict';

angular.module('RedhatAccessCases')
  .directive('rhaFileUpload', function () {
    return {
      template: '<div>fileupload</div>',
      restrict: 'EA',
      link: function postLink(scope, element, attrs) {
        element.text('this is the case/fileUpload directive');
      }
    };
  });
