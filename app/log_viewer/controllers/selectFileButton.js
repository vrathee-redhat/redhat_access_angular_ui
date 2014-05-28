'use strict';

angular.module('RedhatAccess.logViewer')
.controller('selectFileButton', [
	'$scope', 
	'$rootScope',
	'$http', 
	'$location',
	'files', 
	'AlertService', 
	'LOGVIEWER_EVENTS',
	function($scope,$rootScope, $http, $location,
	files, AlertService, LOGVIEWER_EVENTS) {
		$scope.retrieveFileButtonIsDisabled = files.getRetrieveFileButtonIsDisabled();

		$scope.fileSelected = function() {
			files.setFileClicked(true);
			var sessionId = $location.search().sessionId;
			var userId = $location.search().userId;
			$scope.$parent.$parent.sidePaneToggle = !$scope.$parent.$parent.sidePaneToggle;
			$http(
			{
				method : 'GET',
				url : 'logs?sessionId='
				+ encodeURIComponent(sessionId) + '&userId='
				+ encodeURIComponent(userId) + '&path='
				+ files.selectedFile + '&machine='
				+ files.selectedHost
			}).success(function(data, status, headers, config) {
				files.setFile(data);
			}).error(function(data, status, headers, config) {
				AlertService.addDangerMessage(data);
			});
		};

		$rootScope.$on(LOGVIEWER_EVENTS.allTabsClosed, function() {
             $scope.$parent.$parent.sidePaneToggle = !$scope.$parent.$parent.sidePaneToggle;
        });
}]);