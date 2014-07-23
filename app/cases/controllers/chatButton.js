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
        }
      );

      $scope.chatHackUrl = $sce.trustAsResourceUrl(CHAT_SUPPORT.chatIframeHackUrlPrefix);

      $scope.setChatIframeHackUrl = function () {

        var url = CHAT_SUPPORT.chatIframeHackUrlPrefix + '?sessionId=' + securityService.loginStatus.sessionId + '&ssoName=' + securityService.loginStatus.ssoName;
        $scope.chatHackUrl = $sce.trustAsResourceUrl(url);

      };

      // $scope.checkChatAvailability = function () {
      //   var url = 'https://d.la8cs.salesforceliveagent.com/chat/rest/Visitor/Settings.jsonp?chatted=1&sid=a9e1a868-c774-4d36-a7f8-3ac775f9a607&Settings.prefix=Visitor&Settings.buttonIds=[573A0000000GmiP]&Settings.updateBreadcrumb=1&callback=liveagent._.handlePing&deployment_id=572A0000000GmiP&org_id=00DK000000W3mDA&version=31';
      //   $http.get(url).success(function (data, status, headers, config) {
      //   }).error(function (data, status, headers, config) {
      //   });
      // }
      $scope.init = function () {
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
        $scope.setChatIframeHackUrl();
        if (window.chatInitialized === false) {
          $scope.init();
        } else {
          //$scope.checkChatAvailability();
          location.reload();
        }
      } else {
        $rootScope.$on(AUTH_EVENTS.loginSuccess, function () {
          $scope.setChatIframeHackUrl();
          if (window.chatInitialized === false) {
            $scope.init();
          } else {
            //$scope.checkChatAvailability();
            location.reload();
          }
        });
      }
    }
  ]);