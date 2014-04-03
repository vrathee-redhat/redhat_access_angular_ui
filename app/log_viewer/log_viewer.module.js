 // var testURL = 'http://localhost:8080/LogCollector/';
// angular module
var logViewer = angular.module('RedhatAccess.logViewer',
		[ 'angularTreeview', 'ui.bootstrap', 'RedhatAccess.search']);

logViewer.config(function($urlRouterProvider) {
		}).config([ '$stateProvider', function($stateProvider) {
			$stateProvider.state('logviewer', {
				url : "/logviewer",
				templateUrl : 'log_viewer/views/log_viewer.html'
			})
		} ]);

logViewer.factory('files', function() {
	var fileList = '';
	var selectedFile = '';
	var selectedHost = '';
	var file = '';
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
		}
	};
});

logViewer.service('accordian', function() {
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
});

angular.element(document).ready(function() {

	c = angular.element(document.querySelector('#controller-demo')).scope();
});

logViewer.controller('fileController', function($scope, files) {
	$scope.roleList = '';
	$scope.updateSelected = function() {
		if ($scope.mytree.currentNode != null
				&& $scope.mytree.currentNode.fullPath != null) {
			files.setSelectedFile($scope.mytree.currentNode.fullPath);
			// files.setSelectedFile($scope.mytree.currentNode.roleName);
		}
	};
	$scope.$watch(function() {
		return files.fileList;
	}, function() {
		$scope.roleList = files.fileList;
	});
});

logViewer.controller('DropdownCtrl', function($scope, $http, $location, files) {
	$scope.blah = "Please Select the Machine";
	$scope.items = [];
	var sessionId = $location.search().sessionId;
	$scope.init = function() {
		$http({
			method : 'GET',
			url : 'GetMachineList?sessionId=' + encodeURIComponent(sessionId)
		}).success(function(data, status, headers, config) {
			$scope.items = data;
		}).error(function(data, status, headers, config) {
			var i = 0;
			// called asynchronously if an error occurs
			// or server returns response with an error status.
		});
	};
	$scope.machineSelected = function() {
		var sessionId = $location.search().sessionId;
		var userId = $location.search().userId;
		files.selectedHost = this.choice;
		$scope.blah = this.choice;
		$http(
				{
					method : 'GET',
					url : 'GetFileList?hostName=' + files.selectedHost
							+ '&sessionId=' + encodeURIComponent(sessionId)
							+ '&userId=' + encodeURIComponent(userId)
				}).success(function(data, status, headers, config) {
			var tree = new Array();
			parseList(tree, data);
			files.setFileList(tree);
		}).error(function(data, status, headers, config) {
			// called asynchronously if an error occurs
			// or server returns response with an error status.
		});
	};
});

logViewer.controller('selectFileButton', function($scope, $http, $location,
		files) {
	$scope.fileSelected = function() {
		var sessionId = $location.search().sessionId;
		var userId = $location.search().userId;
		$scope.$parent.opens = !$scope.$parent.opens;
		$http(
				{
					method : 'GET',
					url : 'GetLogFile?sessionId='
							+ encodeURIComponent(sessionId) + '&userId='
							+ encodeURIComponent(userId) + '&filePath='
							+ files.selectedFile + '&hostName='
							+ files.selectedHost
				}).success(function(data, status, headers, config) {
			files.file = data;
		}).error(function(data, status, headers, config) {
			// called asynchronously if an error occurs
			// or server returns response with an error status.
		});
	};
});

logViewer.controller('TabsDemoCtrl', [
		'$scope',
		'files',
		'accordian',
		'SearchResultsService',
		function($scope, files, accordian, SearchResultsService) {
			$scope.tabs = [ {
				shortTitle : "Short Sample Log File",
				longTitle : "Long Log File",
				content : "Sample Log Text"
			} ];

			$scope.$watch(function() {
				return files.file;
			}, function() {
				if (files.file != null && files.selectedFile != null) {
					file = new Object();
					file.longTitle = files.selectedHost + " : "
							+ files.selectedFile;
					var splitFileName = files.selectedFile.split("/");
					var fileName = splitFileName[splitFileName.length - 1];
					file.shortTitle = files.selectedHost + ":" + fileName;
					file.content = files.file;
					files.file = null;
					$scope.tabs.push(file);
				}
			});
			$scope.removeTab = function(index) {
				$scope.tabs.splice(index, 1);
			};

			$scope.checked = false; // This will be
			// binded using the
			// ps-open attribute

			$scope.diagnoseText = function() {
				if (!$scope.$parent.open) {
					$scope.$parent.open = !$scope.$parent.open;
				}
				var text = "";
				if (window.getSelection) {
					text = window.getSelection().toString();
				} else if (document.selection
						&& document.selection.type != "Control") {
					text = document.selection.createRange().text;
				}
				if (text != "") {
					$scope.checked = !$scope.checked;
					SearchResultsService.diagnose(text, 5);
					// strata.diagnose(text, onSuccess = function(response) {
					// var group = new Object();
					// group.title = response.title;
					// group.content = response.issue.text;
					// accordian.addGroup(group);
					// $scope.$apply();
					// }, onFailure = function(response) {
					// // Iterate over the response array
					// // response.forEach(someHandler);
					// console.log(response);
					// }, 5);
				}
			};
		} ]);

logViewer.controller('AccordionDemoCtrl', function($scope, accordian) {
	$scope.oneAtATime = true;
	$scope.groups = accordian.getGroups();
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
				var blah = new Object();
				blah.roleName = node;
				blah.roleId = node;
				if (splitPath.length == 1) {
					blah.fullPath = fullFilePath;
				}
				blah.children = new Array();
				tree.push(blah);
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

logViewer.directive('resizeableFileView', function($window) {
  return function($scope) {
    $scope.initializeWindowSize = function() {
      return $scope.windowHeight = $window.innerHeight - 225;
    };
    $scope.initializeWindowSize();
    return angular.element($window).bind('resize', function() {
      $scope.initializeWindowSize();
      return $scope.$apply();
    });
  };
});

logViewer.directive('resizeableSolutionView', function($window) {
  return function($scope) {
    $scope.initializeWindowSize = function() {
      return $scope.windowHeight = $window.innerHeight - 140;

    };
    $scope.initializeWindowSize();
    return angular.element($window).bind('resize', function() {
      $scope.initializeWindowSize();
      return $scope.$apply();
    });
  };
});

logViewer.directive('resizeableDemoLeftView', function($window) {
  return function($scope) {
    $scope.initializeWindowSize = function() {
      return $scope.windowHeight = $window.innerHeight - 35;

    };
    $scope.initializeWindowSize();
    return angular.element($window).bind('resize', function() {
      $scope.initializeWindowSize();
      return $scope.$apply();
    });
  };
});

