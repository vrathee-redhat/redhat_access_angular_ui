'use strict';

angular.module('RedhatAccess.cases')
.service('RecommendationsService', [
  'strataService',
  'CaseService',
  '$q',
  function (strataService, CaseService, $q) {

    this.recommendations = [];
    this.populateCallback = function() {};

    var currentData = {};
    this.loadingRecommendations = false;

    var setCurrentData = function () {
      currentData = {
        product: CaseService.case.product,
        version: CaseService.case.version,
        summary: CaseService.case.summary,
        description: CaseService.case.description
      };
    };
    setCurrentData();

    this.clear = function() {
      this.recommendations = [];
    };

    this.setPopulateCallback = function(callback) {
      this.populateCallback = callback;
    };

    this.populateRecommendations = function (max) {

      var masterDeferred = $q.defer();

      masterDeferred.promise.then(this.populateCallback);

      var newData = {
        product: CaseService.case.product,
        version: CaseService.case.version,
        summary: CaseService.case.summary,
        description: CaseService.case.description
      };

      if (!angular.equals(currentData, newData) && !this.loadingRecommendations) {
        this.loadingRecommendations = true;
        setCurrentData();
        var deferreds = [];

        strataService.problems(currentData, max).then(
            angular.bind(this, function(solutions) {
              //retrieve details for each solution
              solutions.forEach(function (solution) {
                var deferred = strataService.solutions.get(solution.uri);
                deferreds.push(deferred);
              });

              $q.all(deferreds).then(
                  angular.bind(this, function (solutions) {
                    this.recommendations = [];

                    solutions.forEach(angular.bind(this, function (solution) {
                      if (solution !== undefined) {
                        solution.resource_type = "Solution";
                        this.recommendations.push(solution);
                      }
                    }));
                    this.loadingRecommendations = false;
                    masterDeferred.resolve();
                  }),
                  angular.bind(this, function (error) {
                    this.loadingRecommendations = false;
                    masterDeferred.resolve();
                  })
              );
            })
        );
      }

      return masterDeferred.promise;
    };
  }]);
