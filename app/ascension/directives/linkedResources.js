'use strict';
angular.module('RedhatAccess.ascension').directive('rhaLinkedresources', function () {
    return {
        templateUrl: 'ascension/views/linkedResources.html',
        restrict: 'A',
        controller: 'LinkedResources'
    };
});
