'use strict';
/*jshint unused:vars */
angular.module('RedhatAccess.cases').directive('rhaNewbase', function () {
    return {
        templateUrl: 'cases/views/newBase.html',
        restrict: 'A',
	    scope: {
		    hideSticky: '='
	    },
	    link: function postLink(scope, element, attrs) {
			function findY(el) {
				var staticPos = $(el).offset().top;
				return staticPos;
			}

		    $(window).scroll(function() {
			    var yStatic = findY('#sticky-ricky-static');
			    var ySticky = findY('#sticky-ricky-sticky');

				if(ySticky > yStatic) {
					scope.hideSticky = true;
				} else {
					scope.hideSticky = false;
				}
			    //console.log('stickystatic ' + yStatic + ' sticky ' +  ySticky);
			    console.log(scope.hideSticky);
		    });
	    }
    };
});