'use strict';

angular.module('RedhatAccess.cases')
.service('AlertService', [
  '$filter',
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
  }]);
