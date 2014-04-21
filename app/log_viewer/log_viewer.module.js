//var testURL = 'http://localhost:8080/LogCollector/';
// angular module
angular.module('RedhatAccess.logViewer',
	[ 'angularTreeview', 'ui.bootstrap', 'RedhatAccess.search'])

.config(function($urlRouterProvider) {
}).config([ '$stateProvider', function($stateProvider) {
	$stateProvider.state('logviewer', {
		url : "/logviewer",
		templateUrl : 'log_viewer/views/log_viewer.html'
	})
} ]).value('hideMachinesDropdown', false)

.factory('files', function() {
	var fileList = '';
	var selectedFile = '';
	var selectedHost = '';
	var file = '';
	var retrieveFileButtonIsDisabled = {check : true};
	var fileClicked = {check : false};
	var activeTab = null;
	return {
		getFileList : function() {
			return fileList;
		},

		setFileList : function(fileList) {
			this.fileList = fileList;
		},
		getSelectedFile : function() {
			return selectedFile;
		},

		setSelectedFile : function(selectedFile) {
			this.selectedFile = selectedFile;
		},
		getFile : function() {
			return file;
		},

		setFile : function(file) {
			this.file = file;
		}, 

		setRetrieveFileButtonIsDisabled : function(isDisabled){
			retrieveFileButtonIsDisabled.check = isDisabled;
		},

		getRetrieveFileButtonIsDisabled : function() {
			return retrieveFileButtonIsDisabled;
		},
		setFileClicked : function(isClicked){
			fileClicked.check = isClicked;
		},

		getFileClicked : function() {
			return fileClicked;
		},
		setActiveTab : function(activeTab){
			this.activeTab = activeTab;
		},

		getActiveTab : function() {
			return activeTab;
		}
	};
})

.service('accordian', function() {
	var groups = new Array();
	return {
		getGroups : function() {
			return groups;
		},
		addGroup : function(group) {
			groups.push(group);
		},
		clearGroups : function() {
			groups = '';
		}
	};
})
.controller('fileController', function($scope, files) {
	$scope.roleList = '';

	$scope.$watch(function() {
		return $scope.mytree.currentNode;
	}, function() {
		if ($scope.mytree.currentNode != null
			&& $scope.mytree.currentNode.fullPath != null) {
			files.setSelectedFile($scope.mytree.currentNode.fullPath);
			files.setRetrieveFileButtonIsDisabled(false);
		} else {
			files.setRetrieveFileButtonIsDisabled(true);
		}
	});
	$scope.$watch(function() {
		return files.fileList;
	}, function() {
		$scope.roleList = files.fileList;
	});
})
.controller('DropdownCtrl', function($scope, $http, $location, files, hideMachinesDropdown) {
	$scope.machinesDropdownText = "Please Select the Machine";
	$scope.items = [];
	$scope.hideDropdown = hideMachinesDropdown;
	$scope.loading = false;
	var sessionId = $location.search().sessionId;

	$scope.getMachines = function() {
		$http({
			method : 'GET',
			url : 'machines?sessionId=' + encodeURIComponent(sessionId)
		}).success(function(data, status, headers, config) {
			$scope.items = data;
		}).error(function(data, status, headers, config) {
			var i = 0;
			// called asynchronously if an error occurs
			// or server returns response with an error status.
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
			// called asynchronously if an error occurs
			// or server returns response with an error status.
		});
	};
	if(hideMachinesDropdown){
		$scope.machineSelected();
	} else{
		$scope.getMachines();
	}
})
.controller('selectFileButton', function($scope, $http, $location,
	files) {
	$scope.retrieveFileButtonIsDisabled = files.getRetrieveFileButtonIsDisabled();

	$scope.fileSelected = function() {
		files.setFileClicked(true);
		var sessionId = $location.search().sessionId;
		var userId = $location.search().userId;
		$scope.$parent.sidePaneToggle = !$scope.$parent.sidePaneToggle;
		$http(
		{
			method : 'GET',
			url : 'logs?sessionId='
			+ encodeURIComponent(sessionId) + '&userId='
			+ encodeURIComponent(userId) + '&path='
			+ files.selectedFile + '&machine='
			+ files.selectedHost
		}).success(function(data, status, headers, config) {
			files.file = data;
		}).error(function(data, status, headers, config) {
			// called asynchronously if an error occurs
			// or server returns response with an error status.
		});
	};
})
.controller('TabsDemoCtrl', [
	'$scope',
	'$http',
	'$location',
	'files',
	'accordian',
	'SearchResultsService',
	'securityService',
	function($scope, $http, $location, files, accordian, SearchResultsService, securityService) {
		$scope.tabs = [ {
			shortTitle : "Short Sample Log File",
			longTitle : "Long Log File",
			content : "Sample Log Text"
		} ];
		$scope.isDisabled = true;
		$scope.textSelected = false;
		$scope.isLoading = false;
		$scope.$watch(function() {
			return files.getFileClicked().check;
		}, function() {
			if(files.getFileClicked().check && files.selectedFile != null){
				tab = new Object();
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
				files.setActiveTab(tab);
				files.setFileClicked(false);
			}
		});
		$scope.$watch(function() {
			return files.file;
		}, function() {
			if (files.file != null && files.activeTab  != null) {
				files.activeTab.content = files.file;
				$scope.isLoading = false;
				files.file = null;
			}
		});
		$scope.$watch(function() {
			return SearchResultsService.searchInProgress.value;
		}, function() {
			if (SearchResultsService.searchInProgress.value == true) {
				$scope.isDisabled = true;
			} else if(SearchResultsService.searchInProgress.value == false && $scope.textSelected == true){
				$scope.isDisabled = false;
			}
		});
		$scope.removeTab = function(index) {
			$scope.tabs.splice(index, 1);
		};

		$scope.checked = false; // This will be
		// binded using the
		// ps-open attribute

		$scope.diagnoseText = function() {
			//$scope.isDisabled = true;
			if(!securityService.isLoggedIn){
				securityService.login();
			}
			this.tt_isOpen = false;
			if (!$scope.$parent.solutionsToggle) {
				$scope.$parent.solutionsToggle = !$scope.$parent.solutionsToggle;
			}
			var text = strata.utils.getSelectedText();
			if (text != "") {
				$scope.checked = !$scope.checked;
				SearchResultsService.diagnose(text, 5);
			}
			//$scope.sleep(5000, $scope.checkTextSelection);
		};

		$scope.refreshTab = function(index){
			var sessionId = $location.search().sessionId;
			var userId = $location.search().userId;
			// $scope.tabs[index].content = '';
			//TODO reuse this code from above
			$http(
			{
				method : 'GET',
				url : 'logs?sessionId='
				+ encodeURIComponent(sessionId) + '&userId='
				+ encodeURIComponent(userId) + '&path='
				+ files.selectedFile + '&machine='
				+ files.selectedHost
			}).success(function(data, status, headers, config) {
				$scope.tabs[index].content = data;
			}).error(function(data, status, headers, config) {
		// called asynchronously if an error occurs
		// or server returns response with an error status.
			});
		};
		$scope.enableDiagnoseButton = function(){
			//Gotta wait for text to "unselect"
			$scope.sleep(1, $scope.checkTextSelection);
		};
		$scope.checkTextSelection = function(){
			if(strata.utils.getSelectedText()){
				$scope.textSelected = true;
				if(SearchResultsService.searchInProgress.value){
					$scope.isDisabled = true;
				} else {
					$scope.isDisabled = false;
				}
			} else{
				$scope.textSelected = false;
				$scope.isDisabled = true;
			}
			$scope.$apply();
		};

		$scope.sleep = function(millis, callback) {
			setTimeout(function()
        		{ callback(); }
			, millis);
		};
		}])

.controller('AccordionDemoCtrl', function($scope, accordian) {
	$scope.oneAtATime = true;
	$scope.groups = accordian.getGroups();
})

.directive('fillDown', function($window, $timeout) {
	return {
		restrict: 'EA',
		link: function postLink(scope, element, attrs) {
			scope.onResizeFunction = function() {
				var distanceToTop = element[0].getBoundingClientRect().top;
				var height = $window.innerHeight - distanceToTop - 21;
				if(element[0].id == 'fileList'){
					height -= 34;
				}
				return scope.windowHeight = height;
			};
      // This might be overkill?? 
      //scope.onResizeFunction();
      angular.element($window).bind('resize', function() {
      	scope.onResizeFunction();
      	scope.$apply();
      });
      angular.element($window).bind('click', function() {
      	scope.onResizeFunction();
      	scope.$apply();
      });
      $timeout(scope.onResizeFunction, 100);
      // $(window).load(function(){
      // 	scope.onResizeFunction();
      // 	scope.$apply();
      // });
      // scope.$on('$viewContentLoaded', function() {
      // 	scope.onResizeFunction();
      // 	//scope.$apply();
      // });
  }
};
});

function parseList(tree, data) {
	var files = data.split("\n");
	for ( var i in files) {
		var file = files[i];
		var splitPath = file.split("/");
		returnNode(splitPath, tree, file);
	}
}

function returnNode(splitPath, tree, fullFilePath) {
	if (splitPath[0] != null) {
		if (splitPath[0] != "") {
			var node = splitPath[0];
			var match = false;
			var index = 0;
			for ( var i in tree) {
				if (tree[i].roleName == node) {
					match = true;
					index = i;
					break;
				}
			}
			if (!match) {
				var object = new Object();
				object.roleName = node;
				object.roleId = node;
				if (splitPath.length == 1) {
					object.fullPath = fullFilePath;
				}
				object.children = new Array();
				tree.push(object);
				index = tree.length - 1;
			}

			splitPath.shift();
			returnNode(splitPath, tree[index].children, fullFilePath);
		} else {
			splitPath.shift();
			returnNode(splitPath, tree, fullFilePath);
		}
	}
}