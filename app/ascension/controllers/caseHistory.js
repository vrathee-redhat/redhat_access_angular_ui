'use strict';
/*jshint camelcase: false */
angular.module('RedhatAccess.ascension').controller('CaseHistory', [
    '$scope',
    'CaseDetailsService',
    'RHAUtils',
    '$sce',
    function ($scope, CaseDetailsService, RHAUtils, $sce) {
    	$scope.CaseDetailsService = CaseDetailsService;

    	$scope.parseHistoryHtml = function (text) {
            var parsedHtml = '';
            if (RHAUtils.isNotEmpty(text)) {
                var rawHtml = text.toString();
                parsedHtml = $sce.trustAsHtml(rawHtml);
            }
            return parsedHtml;
        };
    }
]);
