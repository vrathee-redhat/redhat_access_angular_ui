'use strict';
/*jshint camelcase: false*/
angular.module('RedhatAccess.cases').controller('NewRouter', [
    '$scope',
    'securityService',
    'AUTH_EVENTS',
    function ($scope, securityService, AUTH_EVENTS) {
        $scope.shouldRoute = false;

        if (securityService.loginStatus.isLoggedIn) {
            if(securityService.loginStatus.authedUser.account_number !== undefined){
                var testgroup = '';
                if(securityService.loginStatus.authedUser.account_number % 2 === 1){
                    $scope.shouldRoute = true;
                    testgroup = 'ABTestInlineRecommendations';
                } else{
                    testgroup = 'ABTestSideRecommendations';
                }
                if (window.chrometwo_require !== undefined) {
                    chrometwo_require(['analytics/attributes', 'analytics/main'], function(attrs, paf) {
                        paf.trigger("ABTestImpression");
                        attrs.set("ABTestCampaign", ["ABTestTitle", testgroup]);
                        attrs.harvest();
                        paf.report();
                    });
                }
            }
        }
        $scope.$on(AUTH_EVENTS.loginSuccess, function () {
            if(securityService.loginStatus.authedUser.account_number !== undefined){
                var testgroup = '';
                if(securityService.loginStatus.authedUser.account_number % 2 === 1){
                    $scope.shouldRoute = true;
                    testgroup = 'ABTestInlineRecommendations';
                } else{
                    testgroup = 'ABTestSideRecommendations';
                }
                if (window.chrometwo_require !== undefined) {
                    chrometwo_require(['analytics/attributes', 'analytics/main'], function(attrs, paf) {
                        paf.trigger("ABTestImpression");
                        attrs.set("ABTestCampaign", ["ABTestTitle", testgroup]);
                        attrs.harvest();
                        paf.report();
                    });
                }
            }
        });
    }
]);
