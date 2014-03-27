'use strict';

angular.module('RedhatAccessCases')
.factory('attachments', ['$q', function ($q) {
  return {
    items: [],
    post: function(attachment, caseNumber) {

      var deferred = $q.defer();

      strata.cases.attachments.post(
          attachment,
          caseNumber,
          function(response, code, xhr) {
            deferred.resolve(xhr.getResponseHeader('Location'));
          },
          function(error) {
            console.log(error);
            deferred.reject(error);
          }
      );

      return deferred.promise;
    },
    delete: function(id, caseNumber) {

      var deferred = $q.defer();

      strata.cases.attachments.delete(
          id,
          caseNumber,
          function(response) {
            deferred.resolve(response);
          },
          function(error) {
            deferred.reject(error);
          }
      );

      return deferred.promise;
    }
  };
}]);
