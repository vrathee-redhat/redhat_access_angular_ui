'use strict';

angular.module('RedhatAccessCases')
    .controller(
    'NewController',
    function ($scope, productsJSON) {
      $scope.products = productsJSON;
      $scope.versions = [];

      $scope.getProductVersions = function(product) {
//        console.log(product);
        strata.products.versions(
            product.code,
            function(response){
              console.log(response);
              $scope.versions = response;
              $scope.$apply();
            },
            function(error){
              console.log(error);
            });
      }
    });
