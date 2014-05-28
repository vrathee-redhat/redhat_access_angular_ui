'use strict';

angular.module('RedhatAccess.logViewer')
.directive('tabContent', function () {
  return {
    template: '<pre id="resizeable-file-view" class="no-line-wrap"ng-bind-html="getContent()"></pre>',
    restrict: 'EA',
    // link: function(scope, iElement, iAttrs, ctrl) {
    // 	scope.$watch('tab.content', function(newValue, oldValue) {
    //             if (newValue)
    //                 console.log("I see a data change!");
    //         });
    // }
  };
});