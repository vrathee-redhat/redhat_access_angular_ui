'use strict';

angular.module('RedhatAccess.logViewer')
.controller('DropdownCtrl', [
	'$scope',
	'$rootScope', 
	'$http', 
	'$location', 
	'files', 
	'hideMachinesDropdown',
	'AlertService', 
	'LOGVIEWER_EVENTS',
	function($scope, $rootScope, $http, $location, files, hideMachinesDropdown, AlertService, LOGVIEWER_EVENTS) {
		$scope.machinesDropdownText = "Please Select the Machine";
		$scope.items = [];
		$scope.hideDropdown = hideMachinesDropdown.value;
		$scope.loading = false;
		$scope.retrieveFileButtonIsDisabled = files.getRetrieveFileButtonIsDisabled();
		var sessionId = $location.search().sessionId;

		$scope.getMachines = function() {
			$http({
				method : 'GET',
				url : 'machines?sessionId=' + encodeURIComponent(sessionId)
			}).success(function(data, status, headers, config) {
				$scope.items = data;
			}).error(function(data, status, headers, config) {
				AlertService.addDangerMessage(data);
			});
		};
		$scope.machineSelected = function() {
			$scope.loading = true;
			var sessionId = $location.search().sessionId;
			var userId = $location.search().userId;
			files.selectedHost = this.choice;
			$scope.machinesDropdownText = this.choice;
			$http(
			{
				method : 'GET',
				url : 'logs?machine=' + files.selectedHost
				+ '&sessionId=' + encodeURIComponent(sessionId)
				+ '&userId=' + encodeURIComponent(userId)
			}).success(function(data, status, headers, config) {
				$scope.loading = false;
				var tree = new Array();
				parseList(tree, data);
				files.setFileList(tree);
			}).error(function(data, status, headers, config) {
				$scope.loading = false;
				AlertService.addDangerMessage(data);
			});
		};
		if($scope.hideDropdown){
			$scope.machineSelected();
		} else{
			$scope.getMachines();
		}

		$scope.fileSelected = function() {
			if(!$scope.retrieveFileButtonIsDisabled.check){
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
			}
		};

		$rootScope.$on(LOGVIEWER_EVENTS.allTabsClosed, function() {
             $scope.$parent.$parent.sidePaneToggle = !$scope.$parent.$parent.sidePaneToggle;
        });
}]);