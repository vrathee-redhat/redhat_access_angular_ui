'use strict';
/*jshint unused:vars */
angular.module('RedhatAccess.cases').directive('rhaManagegroupusers', function () {
    return {
        templateUrl: 'cases/views/manageGroupUsers.html',
        restrict: 'A',
        controller: 'ManageGroupUsers',
        link: function postLink(scope, element, attrs) {
	        scope.$on('$destroy', function () {
	            element.remove();
	        });
	    }
    };
});