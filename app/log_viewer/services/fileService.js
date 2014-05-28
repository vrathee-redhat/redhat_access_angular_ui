'use strict';

angular.module('RedhatAccess.logViewer')
.factory('files', ['$rootScope', 'LOGVIEWER_EVENTS', function($rootScope, LOGVIEWER_EVENTS) {
	var fileList = '';
	var selectedFile = '';
	var selectedHost = '';
	var retrieveFileButtonIsDisabled = {check : true};
	var fileClicked = {check : false};
	var filesArray = null;
	
	function parseFile(file){
		var split = file.split("\n");
		for(var i = 0; i < split.length; i++){
			var text = split[i];
			split[i] = i + ": " + text;
		}
		return split;
	}

	function getFileLines(fileArray, start, length){
		var fileLines = new String();
		for(var i = start; i < start + length; i++){
			if(i < fileArray.length){
				var line = fileArray[i];
				//line = line.replace('<', '&lt;');
				//line = line.replace('>', '&gt;');
				//line = line.replace('\"', '&quot;');
				//line = line.replace('&', '&amp;');
				//line = line.replace('\'', '&#39;');
				if (line.toLowerCase().indexOf(' error ') != -1){
				    line = "<span class=\"error\">" + line + "</span>\n";
				} else if (line.toLowerCase().indexOf(' warn ') != -1){
				    line = "<span class=\"warn\">" + line + "</span>\n";
				} else{
					line = "<span>" + line + "</span>\n";
				}
				fileLines = fileLines.concat(line);
			} else{
				break;
			}
		}
		return fileLines;
	}

	return {
		getFilesArray : function(){
			return filesArray
		},
		addToFilesArray: function(file){
			if(!this.filesArray){
				this.filesArray = new Object();
			}
			this.filesArray[file.name] = file;
		},
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
		getFile : function(fileName, start, length) {
			return getFileLines(this.filesArray[fileName].contents, start, length);
		},

		setFile : function(fileIn) {
			var file = new Object();
			file.name = this.selectedHost + ":" + this.selectedFile;
			file.contents = parseFile(fileIn);
			this.addToFilesArray(file);
			$rootScope.$broadcast(LOGVIEWER_EVENTS.fileParsed, file.name);
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
		}
	};
}]);