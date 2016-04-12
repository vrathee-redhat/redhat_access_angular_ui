'use strict';
angular.module('RedhatAccess.cases').directive('rhaBookmarkedAccountsSelect', function () {
   return {
      templateUrl: 'cases/views/bookmarkedAccountSelect.html',
       controller: 'BookmarkedAccountSelect',
       restrict: 'A',
       scope: {
           selectedAccount: '=',
           selectedAccountChanged: '&'
       }
   };
});
