'use strict';
/*jshint unused:vars */
/*jshint camelcase: false */
angular.module('RedhatAccess.cases').service('GroupUserService', [
    'strataService',
    function (strataService) {
        this.reloadTable = {};
        this.groupsOnScreen = [];
    }
]);