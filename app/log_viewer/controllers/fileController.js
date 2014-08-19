'use strict';

angular.module('RedhatAccess.logViewer')
.controller('fileController', [
  '$scope',
  'files',
  function($scope, files) {
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
}]);
