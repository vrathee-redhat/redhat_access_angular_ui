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
      $scope.closeable = true;

      $scope.closeAlert = function(index) {
        AlertService.alerts.splice(index, 1);
      }
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

      this.addStrataErrorMessage = function(error) {
        var existingMessage =
            $filter('filter')(this.alerts, {type: ALERT_TYPES.DANGER, message: error.message})

        if (existingMessage.length < 1) {
          this.addDangerMessage(error.message);
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
