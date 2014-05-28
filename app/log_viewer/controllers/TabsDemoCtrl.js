'use strict';

angular.module('RedhatAccess.logViewer')
.controller('TabsDemoCtrl', [
	'$rootScope',
	'$sce',
	'$scope',
	'$http',
	'$location',
	'files',
	'accordian',
	'SearchResultsService',
	'securityService',
	'AlertService',
	'LOGVIEWER_EVENTS',
	function($rootScope, $sce, $scope, $http, $location, files, accordian, SearchResultsService, securityService, AlertService,  LOGVIEWER_EVENTS) {
		$scope.tabs = [];
		$scope.isLoading = false;
		$scope.lineChunkSize = 50;
		$scope.$watch(function() {
			return files.getFileClicked().check;
		}, function() {
			if(files.getFileClicked().check && files.selectedFile != null){
				var tab = new Object();
				if(files.selectedHost != null){
					tab.longTitle = files.selectedHost + ":"
				} else {
					tab.longTitle = new String();
				}
				tab.longTitle = tab.longTitle.concat(files.selectedFile);
				var splitFileName = files.selectedFile.split("/");
				var fileName = splitFileName[splitFileName.length - 1];
				
				if(files.selectedHost != null){
					tab.shortTitle = files.selectedHost + ":"
				} else {
					tab.shortTitle = new String();
				}
				tab.shortTitle = tab.shortTitle.concat(fileName);
				tab.active = true;
				$scope.tabs.push(tab);
				$scope.isLoading = true;
				files.setFileClicked(false);
			}
		});
		$rootScope.$on(LOGVIEWER_EVENTS.fileParsed, function(eventInfo, fileName) {
			for( var i = 0; i < $scope.tabs.length; i++){
				if($scope.tabs[i] != null && $scope.tabs[i].longTitle === fileName){
					$scope.tabs[i].linesDisplayed = 0;
					$scope.tabs[i].content = files.getFile($scope.tabs[i].longTitle, $scope.tabs[i].linesDisplayed, $scope.lineChunkSize);
					$scope.tabs[i].linesDisplayed += $scope.lineChunkSize;
					$scope.isLoading = false;
				}
			}
        });
			
		$scope.$watch(function() {
			return SearchResultsService.searchInProgress.value;
		}, function() {
			if (SearchResultsService.searchInProgress.value == true) {
				$scope.$parent.isDisabled = true;
			} else if(SearchResultsService.searchInProgress.value == false && $scope.$parent.textSelected == true){
				$scope.$parent.isDisabled = false;
			}
		});
		$scope.removeTab = function(index) {
			$scope.tabs.splice(index, 1);
			if ($scope.tabs.length < 1){
				$rootScope.$broadcast(LOGVIEWER_EVENTS.allTabsClosed);
			}
		};

		$scope.checked = false; // This will be
		// binded using the
		// ps-open attribute

		$scope.diagnoseText = function() {
			//$scope.isDisabled = true;
			var text = strata.utils.getSelectedText();
			securityService.validateLogin(true).
			then( function(){
				//Removed in refactor, no loger exists.  Think it hides tool tip??
				//this.tt_isOpen = false;
				if (!$scope.$parent.solutionsToggle) {
					$scope.$parent.solutionsToggle = !$scope.$parent.solutionsToggle;
				}
				
				if (text != "") {
					$scope.checked = !$scope.checked;
					SearchResultsService.diagnose(text, 5);
				}
			});
			// this.tt_isOpen = false;
			// if (!$scope.$parent.solutionsToggle) {
			// 	$scope.$parent.solutionsToggle = !$scope.$parent.solutionsToggle;
			// }
			// var text = strata.utils.getSelectedText();
			// if (text != "") {
			// 	$scope.checked = !$scope.checked;
			// 	SearchResultsService.diagnose(text, 5);
			// }
			//$scope.sleep(5000, $scope.checkTextSelection);
		};

		$scope.getContent = function(){
			var trustedHTML = $sce.trustAsHtml($scope.tabs[this.$index].content);
			return trustedHTML;
		}
		$scope.refreshTab = function(index){
			var sessionId = $location.search().sessionId;
			var userId = $location.search().userId;
			var fileNameForRefresh = this.$parent.tab.longTitle;
			var hostForRefresh = null;
			var splitNameForRefresh = fileNameForRefresh.split(":");
			if(splitNameForRefresh[0] && splitNameForRefresh[1]){
				hostForRefresh = splitNameForRefresh[0];
				fileNameForRefresh = splitNameForRefresh[1];
				$http(
				{
					method : 'GET',
					url : 'logs?sessionId='
					+ encodeURIComponent(sessionId) + '&userId='
					+ encodeURIComponent(userId) + '&path='
					+ fileNameForRefresh+ '&machine='
					+ hostForRefresh
				}).success(function(data, status, headers, config) {
					$scope.tabs[index].content = data;
				}).error(function(data, status, headers, config) {
					AlertService.addDangerMessage(data);
				});
			}
		};

	    $scope.loadMore = function() {
	        $scope.tabs[this.$index].content += files.getFile($scope.tabs[this.$index].longTitle, $scope.tabs[this.$index].linesDisplayed, $scope.lineChunkSize);
	        $scope.tabs[this.$index].linesDisplayed += $scope.lineChunkSize;
    };

}]);