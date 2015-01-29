'use strict';
/*global $ */
angular.module('RedhatAccess.header', []).value('TITLE_VIEW_CONFIG', {
    show: 'false',
    titlePrefix: 'Red Hat Access: '
}).controller('TitleViewCtrl', [
    'TITLE_VIEW_CONFIG',
    '$scope',
    'translate',
    function (TITLE_VIEW_CONFIG, $scope, translate) {
        $scope.showTitle = TITLE_VIEW_CONFIG.show;
        $scope.titlePrefix = TITLE_VIEW_CONFIG.titlePrefix;
        $scope.getPageTitle = function () {
            switch ($scope.page) {
            case 'search':
                return translate('Search');
            case 'caseList':
                return translate('Support Cases');
            case 'caseView':
                return translate('View/Modify Case');
            case 'newCase':
                return translate('New Support Case');
            case 'logViewer':
                return translate('Logs');
            case 'searchCase':
                return translate('Search Support Case');
            case 'manageGroups':
                return translate('Manage Case Groups');
            case 'editGroup':
                return translate('Manage Default Case Groups');
            default:
                return '';
            }
        };
    }
]).directive('rhaTitletemplate', function () {
    return {
        restrict: 'AE',
        scope: { page: '@' },
        templateUrl: 'common/views/title.html',
        controller: 'TitleViewCtrl'
    };
}).service('AlertService', [
    '$filter',
    'AUTH_EVENTS',
    '$rootScope',
    'RHAUtils',
    'translate',
    function ($filter, AUTH_EVENTS, $rootScope, RHAUtils, translate) {
        var ALERT_TYPES = {
                DANGER: 'danger',
                SUCCESS: 'success',
                WARNING: 'warning'
            };
        this.alerts = [];
        //array of {message: 'some alert', type: '<type>'} objects
        this.clearAlerts = function () {
            this.alerts = [];
        };
        this.addAlert = function (alert) {
            this.alerts.push(alert);
        };
        this.removeAlert = function (alert) {
            this.alerts.splice(this.alerts.indexOf(alert), 1);
        };
        this.addDangerMessage = function (message) {
            return this.addMessage(message, ALERT_TYPES.DANGER);
        };
        this.addSuccessMessage = function (message) {
            return this.addMessage(message, ALERT_TYPES.SUCCESS);
        };
        this.addWarningMessage = function (message) {
            return this.addMessage(message, ALERT_TYPES.WARNING);
        };
        this.addMessage = function (message, type) {
            var alert = {
                    message: message,
                    type: type === null ? 'warning' : type
                };
            this.addAlert(alert);
            $('body,html').animate({ scrollTop: $('body').offset().top }, 100);
            //Angular adds a unique hash to each alert during data binding,
            //so the returned alert will be unique even if the
            //message and type are identical.
            return alert;
        };
        this.getErrors = function () {
            var errors = $filter('filter')(this.alerts, { type: ALERT_TYPES.DANGER });
            if (errors === null) {
                errors = [];
            }
            return errors;
        };
        this.addStrataErrorMessage = function (error) {
            if (RHAUtils.isNotEmpty(error)) {
                var errorText=error.message;
                if (error.xhr && error.xhr.responseText){
                    errorText = errorText.concat(' Message: ' + error.xhr.responseText);
                }
                var existingMessage = $filter('filter')(this.alerts, {
                        type: ALERT_TYPES.DANGER,
                        message: errorText,
                    });
                if (existingMessage.length < 1) {
                    this.addDangerMessage(errorText);
                }
            }
        };
        $rootScope.$on(AUTH_EVENTS.logoutSuccess, angular.bind(this, function () {
            this.clearAlerts();
            this.addMessage(translate('You have successfully logged out of the Red Hat Customer Portal.'));
        }));
        $rootScope.$on(AUTH_EVENTS.loginSuccess, angular.bind(this, function () {
            this.clearAlerts();
        }));
    }
]).directive('rhaAlert', function () {
    return {
        templateUrl: 'common/views/alert.html',
        restrict: 'A',
        controller: 'AlertController'
    };
}).controller('AlertController', [
    '$scope',
    'AlertService',
    function ($scope, AlertService) {
        $scope.AlertService = AlertService;
        $scope.closeable = true;
        $scope.closeAlert = function (index) {
            AlertService.alerts.splice(index, 1);
        };
        $scope.dismissAlerts = function () {
            AlertService.clearAlerts();
        };
    }
]).directive('rhaHeader', function () {
    return {
	        templateUrl: 'common/views/header.html',
        restrict: 'A',
        scope: { page: '@' },
        controller: 'HeaderController'
    };
}).controller('HeaderController', [
    '$scope',
    'AlertService',
    'HeaderService',
    'CaseService',
    'COMMON_CONFIG',
    'RHAUtils',
    '$interval',
    '$sce',
    function ($scope, AlertService , HeaderService , CaseService , COMMON_CONFIG , RHAUtils, $interval , $sce) {
        /**
       * For some reason the rhaAlert directive's controller is not binding to the view.
       * Hijacking rhaAlert's parent controller (HeaderController) works
       * until a real solution is found.
       */
        $scope.AlertService = AlertService;
        $scope.HeaderService = HeaderService;
        $scope.closeable = true;
        $scope.closeAlert = function (index) {
            AlertService.alerts.splice(index, 1);
        };
        $scope.dismissAlerts = function () {
            AlertService.clearAlerts();
        };
        $scope.init = function () {
            CaseService.sfdcIsHealthy = COMMON_CONFIG.sfdcIsHealthy;
            HeaderService.sfdcIsHealthy = COMMON_CONFIG.sfdcIsHealthy;
            if (COMMON_CONFIG.doSfdcHealthCheck) {
                $scope.healthTimer = $interval(HeaderService.checkSfdcHealth, COMMON_CONFIG.healthCheckInterval);
            }
        };
        $scope.init();
        $scope.parseSfdcOutageHtml = function () {
            var parsedHtml = '';
            if (RHAUtils.isNotEmpty(COMMON_CONFIG.sfdcOutageMessage)) {
                var rawHtml = COMMON_CONFIG.sfdcOutageMessage;
                parsedHtml = $sce.trustAsHtml(rawHtml);
            }
            return parsedHtml;
        };
        $scope.$on('$destroy', function () {
            $interval.cancel($scope.healthTimer);
        });
    }
]).factory('HeaderService', [
    'COMMON_CONFIG',
    'strataService',
    'CaseService',
    'securityService',
    'AlertService',
    '$q',
    function (COMMON_CONFIG , strataService , CaseService, securityService , AlertService , $q) {
        var service = {
            sfdcIsHealthy: COMMON_CONFIG.sfdcIsHealthy,
            checkSfdcHealth: function() {
                if (securityService.loginStatus.isLoggedIn) {
                    var deferred = $q.defer();
                    strataService.health.sfdc().then(angular.bind(this, function (response) {
                        if (response.name === 'SFDC' && response.status === true) {
                            service.sfdcIsHealthy = true;
                            CaseService.sfdcIsHealthy = true;
                        }
                        deferred.resolve(response);
                    }), angular.bind(this, function (error) {
                        if (error.xhr.status === 502) {
                            service.sfdcIsHealthy = false;
                            CaseService.sfdcIsHealthy = false;
                        }
                        AlertService.addStrataErrorMessage(error);
                        deferred.reject();
                    }));
                    return deferred.promise;
                }
            }
        };
        return service;
    }
]);
