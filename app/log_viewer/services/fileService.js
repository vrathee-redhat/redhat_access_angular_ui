'use strict';
angular.module('RedhatAccess.logViewer').factory('files', function () {
    var fileList = '';
    var selectedFile = '';
    var file = '';
    var retrieveFileButtonIsDisabled = { check: true };
    var fileClicked = { check: false };
    var activeTab = null;
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
        },
        setRetrieveFileButtonIsDisabled: function (isDisabled) {
            retrieveFileButtonIsDisabled.check = isDisabled;
        },
        getRetrieveFileButtonIsDisabled: function () {
            return retrieveFileButtonIsDisabled.check;
        },
        setFileClicked: function (isClicked) {
            fileClicked.check = isClicked;
        },
        getFileClicked: function () {
            return fileClicked;
        },
        setActiveTab: function (activeTab) {
            this.activeTab = activeTab;
        },
        getActiveTab: function () {
            return activeTab;
        }
    };
});