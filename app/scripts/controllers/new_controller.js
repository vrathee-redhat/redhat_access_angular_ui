'use strict';

angular.module('RedhatAccessCases')
    .controller(
    'NewController',
    function ($scope, productsJSON, severityJSON, groupsJSON) {
      $scope.products = productsJSON;
      $scope.versions = [];
      $scope.incomplete = true;
      $scope.severities = severityJSON;
      $scope.groups = groupsJSON;

      // <-- temporary static stuff for screen shots
      $scope.fileName = 'No file chosen'
      $scope.attachments = [
        {
          uri: "https://access.redhat.com/",
          file_name: "first.log",
          description: "The first log",
          length: 20,
          created_by: "Chris Kyrouac",
          created_date: 1393611517000
        },
        {
          uri: "https://access.redhat.com/",
          file_name: "second.log",
          description: "The second log",
          length: 25,
          created_by: "Chris Kyrouac",
          created_date: 1393611517000
        }
      ];

      // --> end temporary stuff

      $scope.validateForm = function() {
        if ($scope.product == null || $scope.product == "" ||
            $scope.version == null || $scope.version == "" ||
            $scope.summary == null || $scope.summary == "" ||
            $scope.description == null || $scope.description == "") {
          $scope.incomplete = true;
        } else {
          $scope.incomplete = false;
        }
      };

      $scope.getProductVersions = function(product) {
        $scope.version = "";

        strata.products.versions(
            product.code,
            function(response){
              $scope.versions = response;
              $scope.validateForm();
              $scope.$apply();
            },
            function(error){
              console.log(error);
            });
      };

      $scope.setPage = function(page) {
        $scope.isPage1 = page == 1 ? true : false;
        $scope.isPage2 = page == 2 ? true : false;
      };

      $scope.doNext = function() {
        $scope.setPage(2);
      };

      $scope.doPrevious = function() {
        $scope.setPage(1);
      };

      $scope.doSubmit = function() {

      };

      $scope.setPage(1);
    });
