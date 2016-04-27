'use strict';
angular.module('RedhatAccess.cases').directive('rhaAccountSearch',function () {
    return {
        templateUrl: 'cases/views/accountSearch.html',
        controller: 'AccountSearch',
        restrict: 'A',
        scope: {}
    };
});
