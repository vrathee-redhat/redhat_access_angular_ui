'use strict';
/*global $ */
angular.module('RedhatAccess.ascension').controller('AccountInformation', [
    '$scope',
    'TOPCASES_EVENTS',
    'AccountService',
    'CaseDetailsService',
    'gettextCatalog',
    function ($scope,TOPCASES_EVENTS, AccountService,CaseDetailsService,gettextCatalog) {

        $scope.AccountService = AccountService;
        $scope.$on(TOPCASES_EVENTS.caseDetailsFetched, function () {
            AccountService.getAccountDetails(CaseDetailsService.kase.account.account_number);
            AccountService.getAccountNotes(CaseDetailsService.kase.account.account_number);
        });

        $scope.getAccountNotesText=function(){
            var accountNotesText="";
            if(AccountService.account.notes)
            {
                //TODO more information needed on how to calculate the latest modified date
               // if(AccountService.account.notes.resource.createdBy.resource.lastModified)
              //  {
                    accountNotesText=accountNotesText.concat(gettextCatalog.getString("Last Modified By"));

              //  }

            }
            return accountNotesText;

        }



    }
]);
