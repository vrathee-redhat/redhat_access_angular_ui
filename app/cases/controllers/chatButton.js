'use strict';
angular.module('RedhatAccess.cases')
  .controller('ChatButton', [
    '$scope',
    'CaseService',
    'securityService',
    'CHAT_SUPPORT',
    'securityService',
    function ($scope, CaseService, SecurityService, CHAT_SUPPORT, securityService) {
      
      var chatToken = securityService.loginStatus.sessionId;
      var login = securityService.loginStatus.loggedInUser;
      var name = 'Keith Roberts';
      var email = 'kroberts@redhat.com';
      var currentCaseNumber = '01250897';
      var accountNumber = '540155';

      if (!window._laq) { 
        window._laq = []; 
      }

      window._laq.push(
        function() {
          liveagent.showWhenOnline(
            CHAT_SUPPORT.chatButtonToken,
            document.getElementById('rha-livechat-enabled-button'));

          liveagent.showWhenOffline(
            CHAT_SUPPORT.chatButtonToken,
            document.getElementById('rha-livechat-disabled-button'));
        }
      );

      if (currentCaseNumber) {
        liveagent
          .addCustomDetail('Case Number', currentCaseNumber)
          .map('Case', 'CaseNumber', false, false, false)
          .saveToTranscript('CaseNumber__c');
      }

      if (chatToken){
        liveagent
          .addCustomDetail('Session ID', chatToken)
          .map('Contact', 'SessionId__c', false, false, false);
      }

      liveagent
        .addCustomDetail('Contact Login', login)
        .map('Contact', 'SSO_Username__c', true, true, true)
        .saveToTranscript('SSO_Username__c');
      liveagent
        .addCustomDetail('Contact E-mail', email)
        .map('Contact', 'Email', false, false, false);
      liveagent
        .addCustomDetail('Account Number', accountNumber)
        .map('Account', 'AccountNumber', true, true, true);
      liveagent.setName(name);
      liveagent.addCustomDetail('Name', name);
      liveagent.setChatWindowHeight('552');

      liveagent.init(
        CHAT_SUPPORT.chatLiveAgentUrlPrefix, 
        CHAT_SUPPORT.chatInitHashOne,
        CHAT_SUPPORT.chatInitHashTwo);

      $scope.openChatWindow = function() {
        liveagent.startChat(CHAT_SUPPORT.chatButtonToken);
      };
    }
  ]);
