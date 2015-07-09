'use strict';
/*global $ */
angular.module('RedhatAccess.ascension').controller('BreachStatus', [
    '$scope',
    '$modal',
    'CaseDetailsService',
    'TOPCASES_EVENTS',
    'gettextCatalog',
    function ($scope, $modal,CaseDetailsService,TOPCASES_EVENTS,gettextCatalog) {
        $scope.CaseDetailsService=CaseDetailsService;
        $scope.$on(TOPCASES_EVENTS.caseDetailsFetched, function () {

        //any processing to be done after the case details are fetched like
        });

        $scope.getBreachInformationText=function(){
            var breachText="";
            //TODO confirm the sbt calculation
            if(CaseDetailsService.kase.sbt){
                var humanized = moment.duration(CaseDetailsService.kase.sbt, 'minutes').humanize();
                if (CaseDetailsService.kase.sbt > 0 ) {
                    breachText= breachText.concat(gettextCatalog.getString("Breaching in {{breachTime}}",{breachTime:humanized}));
                } else {
                    breachText= breachText.concat(gettextCatalog.getString("Breached by {{breachTime}}",{breachTime:humanized}));
                }
            }
            return breachText;
        }

    }
]);

