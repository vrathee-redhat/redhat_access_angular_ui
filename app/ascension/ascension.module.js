'use strict';
var app = angular.module('RedhatAccess.ascension', [
    'RedhatAccess.template',
    'RedhatAccess.security',
    'RedhatAccess.ui-utils',
    'RedhatAccess.common',
    'RedhatAccess.header',
    'RedhatAccess.search'
]).constant('TOPCASES_EVENTS', {
        topCaseFetched: 'top-cases-fetched',
        caseDetailsFetched: 'case-details-fetched'
    }).config([
    '$stateProvider',
    function($stateProvider) {
        $stateProvider.state('ascension', {
            url: '/ascension',
            controller: 'CaseView',
            templateUrl: 'ascension/views/caseView.html'
        });
    }
]);
app.service('UQL',

    function () {
        /**
         * Generic function to decide if a simple object should be considered nothing
         */
        this.and = function(l, r) {
            if ((l != null) && (r != null)) {
                return "(" + l + " and " + r + ")";
            } else if (l != null) {
                return "(" + l + ")";
            } else if (r != null) {
                return "(" + r + ")";
            } else {
                return void 0;
            }
        };
        this.or = function(l, r) {
            if ((l != null) && (r != null)) {
                return "(" + l + " or " + r + ")";
            } else if (l != null) {
                return "(" + l + ")";
            } else if (r != null) {
                return "(" + r + ")";
            } else {
                return void 0;
            }
        };
        this.cond = function(field, op, val) {
            if (val != null) {
                return "" + field + " " + op + " " + val;
            } else {
                return void 0;
            }
        };
    });
