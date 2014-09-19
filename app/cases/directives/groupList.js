'use strict';
/*jshint unused:vars */
angular.module('RedhatAccess.cases').directive('rhaGrouplist', function () {
    return {
        templateUrl: 'cases/views/groupList.html',
        restrict: 'A',
        controller: 'GroupList',
        link: function postLink(scope, element, attrs) {
	        scope.$on('$destroy', function () {
	            element.remove();
	        });
	    }
    };
});