'use strict';
angular.module('RedhatAccess.cases')
  .controller('ChatButton', [
    '$scope',
    'CaseService',
    'securityService',
    'CHAT_SUPPORT',
    'securityService',
    'AUTH_EVENTS',
    '$rootScope',
    '$sce',
    '$http',
    function ($scope, CaseService, SecurityService, CHAT_SUPPORT, securityService, AUTH_EVENTS, $rootScope, $sce, $http) {


      $scope.securityService = securityService;
      if (window.chatInitialized === undefined) {
        window.chatInitialized = false;
      }
      if (!window._laq) {
        window._laq = [];
      }

      window._laq.push(
        function () {
          liveagent.showWhenOnline(
            CHAT_SUPPORT.chatButtonToken,
            document.getElementById('rha-livechat-enabled-button'));

          liveagent.showWhenOffline(
            CHAT_SUPPORT.chatButtonToken,
            document.getElementById('rha-livechat-disabled-button'));
          // liveagent.showWhenOnline(
          //   CHAT_SUPPORT.chatButtonToken,
          //   document.getElementById('rha-livechat-enabled-button2'));

          // liveagent.showWhenOffline(
          //   CHAT_SUPPORT.chatButtonToken,
          //   document.getElementById('rha-livechat-disabled-button2'));


        }
      );


      $scope.chatHackUrl = $sce.trustAsResourceUrl(CHAT_SUPPORT.chatIframeHackUrlPrefix);

      $scope.setChatIframeHackUrl = function () {

        var url = CHAT_SUPPORT.chatIframeHackUrlPrefix + '?sessionId=' + securityService.loginStatus.sessionId + '&ssoName=' + securityService.loginStatus.ssoName;
        $scope.chatHackUrl = $sce.trustAsResourceUrl(url);

      };


      $scope.enableChat = function () {
        $scope.showChat = securityService.loginStatus.isLoggedIn && securityService.loginStatus.hasChat && CHAT_SUPPORT.enableChat;
        return $scope.showChat;

      };
      $scope.showChat = false;
      $scope.init = function () {

        if (!$scope.enableChat()) {
          return;
        }
        var chatToken = securityService.loginStatus.sessionId;
        var ssoName = securityService.loginStatus.ssoName;
        var name = securityService.loginStatus.loggedInUser;
        //var email = 'kroberts@redhat.com';
        var currentCaseNumber = undefined;
        var accountNumber = securityService.loginStatus.account.number;

        if (currentCaseNumber) {
          liveagent
            .addCustomDetail('Case Number', currentCaseNumber)
            .map('Case', 'CaseNumber', false, false, false)
            .saveToTranscript('CaseNumber__c');
        }

        if (chatToken) {
          liveagent
            .addCustomDetail('Session ID', chatToken)
            .map('Contact', 'SessionId__c', false, false, false);
        }

        liveagent
          .addCustomDetail('Contact Login', ssoName)
          .map('Contact', 'SSO_Username__c', true, true, true)
          .saveToTranscript('SSO_Username__c');
        //liveagent
        //  .addCustomDetail('Contact E-mail', email)
        //  .map('Contact', 'Email', false, false, false);
        liveagent
          .addCustomDetail('Account Number', accountNumber)
          .map('Account', 'AccountNumber', true, true, true);
        liveagent.setName(name);
        liveagent.addCustomDetail('Name', name);
        liveagent.setChatWindowHeight('552');
        liveagent.enableLogging();

        liveagent.init(
          CHAT_SUPPORT.chatLiveAgentUrlPrefix,
          CHAT_SUPPORT.chatInitHashOne,
          CHAT_SUPPORT.chatInitHashTwo);
        window.chatInitialized = true;
      };

      $scope.openChatWindow = function () {
        liveagent.startChat(CHAT_SUPPORT.chatButtonToken);
      };

      if (securityService.loginStatus.isLoggedIn) {
        if ($scope.enableChat()) {
          $scope.setChatIframeHackUrl();
          if (window.chatInitialized === false) {
            $scope.init();
          } else {
            location.reload(); // bad hack until we convert to rest
          }
        }
      } else {
        $rootScope.$on(AUTH_EVENTS.loginSuccess, function () {
          if ($scope.enableChat()) {
            $scope.setChatIframeHackUrl();
            if (window.chatInitialized === false) {
              $scope.init();
            } else {
              location.reload(); // bad hack until we convert to rest
            }
          }
        });
      }
      
    }
  ]);