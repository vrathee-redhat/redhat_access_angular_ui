angular.module('RedhatAccess.header', [])
.value('TITLE_VIEW_CONFIG', {
    show: 'false'
})
.controller('TitleViewCtrl', ['TITLE_VIEW_CONFIG', '$scope',
    function(TITLE_VIEW_CONFIG, $scope) {
        $scope.showTitle = TITLE_VIEW_CONFIG.show;
    }])
.directive('rhaTitleTemplate',
    function() {
      return {
          restrict: 'AE',
          scope: {
              pageTitle: '@title'
          },
          templateUrl: 'common/views/title.html',
          controller: 'TitleViewCtrl'
      };
    })
.controller('AlertController', ['$scope', 'AlertService',
    function ($scope, AlertService) {
      $scope.AlertService = AlertService;
    }])
.directive('rhaAlert',
    function () {
      return {
        templateUrl: 'common/views/alert.html',
        restrict: 'E',
        controller: 'AlertController'
      };
    })
.service('AlertService', ['$filter',
    function ($filter) {
      var ALERT_TYPES = {
        DANGER: 'danger',
        SUCCESS: 'success',
        WARNING: 'warning'
      };

      this.alerts = []; //array of {message: 'some alert', type: '<type>'} objects

      this.clearAlerts = function() {
        this.alerts = [];
      };

      this.addAlert = function(alert) {
        this.alerts.push(alert);
      };

      this.addDangerMessage = function(message) {
        this.addMessage(message, ALERT_TYPES.DANGER);
      };

      this.addSuccessMessage = function(message) {
        this.addMessage(message, ALERT_TYPES.SUCCESS);
      };

      this.addWarningMessage = function(message) {
        this.addMessage(message, ALERT_TYPES.WARNING);
      };

      this.addMessage = function(message, type) {
        this.alerts.push({
          message: message,
          type: type == null ? 'warning' : type
        })
      };

      this.getErrors = function() {
        var errors = $filter('filter')(this.alerts, {type: ALERT_TYPES.DANGER});

        if (errors == null) {
          errors = [];
        }

        return errors;
      };

      var buildStrataErrorMessage = function(error) {
        var message = error.status + ': ' + error.statusText;

        function messageWithDetails(message, details) {
          return message + ' - ' + details;
        }

        if (error.responseText != null && error.responseText != '') {
          message = messageWithDetails(message, error.responseText);
        }

        if (error.status == '401') {
          message = messageWithDetails(message, 'Please log in to continue.');
        }

        return message;
      };

      this.addStrataErrorMessage = function(error) {
        var message = buildStrataErrorMessage(error);

        var existingMessage =
            $filter('filter')(this.alerts, {type: ALERT_TYPES.DANGER, message: message})

        if (existingMessage.length < 1) {
          this.addDangerMessage(message);
        }
      };
    }])
.directive('rhaHeader',
    function () {
      return {
        templateUrl: 'common/views/header.html',
        restrict: 'E',
        scope: {
          title: '@'
        }
      };
    });
