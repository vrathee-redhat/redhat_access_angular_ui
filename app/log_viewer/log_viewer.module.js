// angular module
var logViewer = angular.module('logViewer', ['angularTreeview',
	'ui.bootstrap', 'RedhatAccess.search'
]);

logViewer.factory('files', function () {
	var fileList = '';
	var selectedFile = '';
	var selectedHost = '';
	var file = '';
	return {
		getFileList: function () {
			return fileList;
		},

		setFileList: function (fileList) {
			this.fileList = fileList;
		},
		getSelectedFile: function () {
			return selectedFile;
		},

		setSelectedFile: function (selectedFile) {
			this.selectedFile = selectedFile;
		},
		getFile: function () {
			return file;
		},

		setFile: function (file) {
			this.file = file;
		}
	};
});

logViewer.service('accordian', function () {
	var groups = new Array();
	return {
		getGroups: function () {
			return groups;
		},
		addGroup: function (group) {
			groups.push(group);
		},
		clearGroups: function () {
			groups = '';
		}
	};
});


angular.element(document).ready(function () {

	c = angular.element(document.querySelector('#controller-demo')).scope();
});

logViewer.controller('fileController', function ($scope, files) {
	$scope.roleList = '';
	$scope.updateSelected = function () {
		if ($scope.mytree.currentNode != null) {
			//files.setSelectedFile('/Users/Spense/Desktop/server.log');
			files.setSelectedFile($scope.mytree.currentNode.roleName);
		}
	};
	$scope.$watch(function () {
		return files.fileList;
	}, function () {
		$scope.roleList = files.fileList;
	});
});

logViewer.controller('DropdownCtrl', function ($scope, $http, files) {
	$scope.blah = "Please Select the Machine";
	$scope.items = [];
	$scope.init = function () {
		$http({
			method: 'GET',
			url: 'log_viewer/GetMachineList'
		}).success(function (data, status, headers, config) {
			$scope.items = data;
		}).error(function (data, status, headers, config) {
			var i = 0;
			// called asynchronously if an error occurs
			// or server returns response with an error status.
		});
	};
	$scope.machineSelected = function () {
		files.selectedHost = this.choice;
		$scope.blah = this.choice;
		$http({
			method: 'GET',
			url: 'log_viewer/GetFileList'
		}).success(function (data, status, headers, config) {
			files.setFileList(data);
		}).error(function (data, status, headers, config) {
			// called asynchronously if an error occurs
			// or server returns response with an error status.
		});
	};
});

logViewer.controller('selectFileButton', function ($scope, $http, files) {
	$scope.fileSelected = function () {
		$http({
			method: 'GET',
			url: 'log_viewer/GetLogFile?filePath=' + files.selectedFile + '&hostName=localhost'
		}).success(function (data, status, headers, config) {
			files.file = data;
		}).error(function (data, status, headers, config) {
			// called asynchronously if an error occurs
			// or server returns response with an error status.
		});
	};
});

logViewer.controller('TabsDemoCtrl', ['$scope', 'files', 'accordian', 'SearchResultsService',
	function ($scope, files, accordian, SearchResultsService) {
		$scope.tabs = [{
			shortTitle: "Short Sample Log File",
			longTitle: "Long Log File",
			content: "Sample Log Text"
		}];

		$scope.$watch(function () {
			return files.file;
		}, function () {
			if (files.file != null && files.selectedFile != null) {
				file = new Object();
				file.longTitle = files.selectedHost + " : " + files.selectedFile;
				var splitFileName = files.selectedFile.split("/");
				var fileName = splitFileName[splitFileName.length - 1];
				file.shortTitle = files.selectedHost + ":" + fileName;
				file.content = files.file;
				files.file = null;
				$scope.tabs.push(file);
			}
		});
		$scope.removeTab = function (index) {
			$scope.tabs.splice(index, 1);
		};

		$scope.checked = false; // This will be binded using the ps-open attribute

		$scope.diagnoseText = function () {

			var text = "";
			if (window.getSelection) {
				text = window.getSelection().toString();
			} else if (document.selection && document.selection.type != "Control") {
				text = document.selection.createRange().text;
			}
			if (text != "") {
				$scope.checked = !$scope.checked;
				SearchResultsService.diagnose(text, 5);
				// strata.diagnose(text, onSuccess = function (response) {
				// 	var group = new Object();
				// 	group.title = response.title;
				// 	group.content = response.issue.text;
				// 	accordian.addGroup(group);
				// 	$scope.$apply();
				// }, onFailure = function (response) {
				// 	// Iterate over the response array
				// 	// response.forEach(someHandler);
				// 	console.log(response);
				// }, 5);
			}
		};
	}
]);

logViewer.controller('AccordionDemoCtrl', function ($scope, accordian) {
	$scope.oneAtATime = true;
	$scope.groups = accordian.getGroups();
});