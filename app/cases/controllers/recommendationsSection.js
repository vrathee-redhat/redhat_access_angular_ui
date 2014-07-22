'use strict';

angular.module('RedhatAccess.cases')
.controller('RecommendationsSection', [
  'RecommendationsService',
  '$scope',
  'strataService',
  'CaseService',
  'AlertService',
  function(
      RecommendationsService,
      $scope,
      strataService,
      CaseService,
      AlertService) {

    $scope.RecommendationsService = RecommendationsService;

    $scope.recommendationsPerPage = 4;
    $scope.maxRecommendationsSize = 10;

    $scope.selectRecommendationsPage = function(pageNum) {
      //filter out pinned recommendations
      angular.forEach(RecommendationsService.pinnedRecommendations, 
          function(pinnedRec) {
            angular.forEach(RecommendationsService.recommendations,
              function(rec, index) {
                if (angular.equals(rec.id, pinnedRec.id)) {
                  RecommendationsService.recommendations.splice(index, 1);
                }
              }
            );
          }
      );

      angular.forEach(RecommendationsService.handPickedRecommendations,
          function(handPickedRec) {
            angular.forEach(RecommendationsService.recommendations,
              function(rec, index) {
                if (angular.equals(rec.id, handPickedRec.id)) {
                  RecommendationsService.recommendations.splice(index, 1);
                }
              }
            );
          }
      );

      var recommendations = RecommendationsService.pinnedRecommendations.concat(
          RecommendationsService.recommendations);
      recommendations = RecommendationsService.handPickedRecommendations.concat(
          recommendations);
      var start = $scope.recommendationsPerPage * (pageNum - 1);
      var end = start + $scope.recommendationsPerPage;
      end = end > recommendations.length ? recommendations.length : end;
      $scope.recommendationsOnScreen = recommendations.slice(start, end);
    };

    $scope.currentRecPin;
    $scope.pinRecommendation = function(recommendation, $index, $event) {
      $scope.currentRecPin = recommendation;
      $scope.currentRecPin.pinning = true;
      
      var doPut = function(linked) {
        var recJSON = {
          recommendations: {
            recommendation: [
              {
                linked: linked.toString(), 
                resourceId: recommendation.id,
                resourceType: 'Solution'
              }
            ]
          }
        };

        strataService.cases.put(CaseService.kase.case_number, recJSON).then(
            function(response) {
              if (!$scope.currentRecPin.pinned) {
                //not currently pinned, so add it to the pinned list
                RecommendationsService.pinnedRecommendations.push($scope.currentRecPin);
              } else {
                //currently pinned, so remove from pinned list
                angular.forEach(RecommendationsService.pinnedRecommendations,
                  function(rec, index) {
                    if (rec.id === $scope.currentRecPin.id) {
                      RecommendationsService.pinnedRecommendations.splice(index, 1);
                    }
                  });

                //add the de-pinned rec to the top of the list
                //this allows the user to still view the rec, or re-pin it
                RecommendationsService.recommendations.splice(0, 0, $scope.currentRecPin);
              }

              $scope.currentRecPin.pinning = false;
              $scope.currentRecPin.pinned = !$scope.currentRecPin.pinned;
              $scope.selectPageOne();
            }, 
            function(error) {
              $scope.currentRecPin.pinning = false;
              AlertService.addStrataErrorMessage(error);
            }
        );
      }

      recommendation.pinned ? doPut(false) : doPut(true);
    };

    $scope.selectPageOne = function() {
      $scope.selectRecommendationsPage(1);
      $scope.currentRecommendationPage = 1;
    };

    RecommendationsService.setPopulateCallback($scope.selectPageOne);
  }
]);
