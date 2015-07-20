'use strict';
var app = angular.module('RedhatAccess.ascension', [
    'RedhatAccess.template',
    'RedhatAccess.security',
    'RedhatAccess.ui-utils',
    'RedhatAccess.common',
    'RedhatAccess.header'
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
        this.quote = function(s) {
            if ((s != null) && s !== '') {
                return "\"" + s + "\"";
            }
        };
        this.array = function(items, cb) {
            if ((items != null) && items.length > 0) {
                return '[' + angular.forEach(items, function(r){
                        return cb(r)
                    }).join(',') + ']';
            }
        };
    });
