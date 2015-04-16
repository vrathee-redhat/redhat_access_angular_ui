'use strict';
/*jshint unused:vars */
angular.module('RedhatAccess.cases').directive('rhaManagegrouplist', function () {
    return {
        templateUrl: 'cases/views/manageGroupList.html',
        restrict: 'A',
        controller: 'ManageGroupList',
        link: function postLink(scope, element, attrs) {
	        scope.$on('$destroy', function () {
	            element.remove();
	        });
	    }
    };
});