//'use strict';

angular.module('RedhatAccess.cases')
  .service('MockStrataService', [
    'strataService',
    'AlertService',
    'ENTITLEMENTS',
    'RHAUtils',
    'securityService',
    '$q',
    '$filter',
    function(strataService, AlertService, ENTITLEMENTS, RHAUtils, securityService, $q, $filter) { 

       //this.deferred = $q.defer();
      
        return {
          groups: {           
                list: function (ssoUserName) {
                  var deferred = $q.defer();
                  return deferred.promise;              
                }
          },
          accounts: {
                users: function(accountNumber) {
                  var deferred = $q.defer();
                  return deferred.promise;
                }
          },
          cases: {
              comments: {
                  get: function(id) {
                      var deferred = $q.defer();
                      return deferred.promise;
                  }
              },
              filter: function (params) {
                  var deferred = $q.defer();
                  return deferred.promise;
              }
          },
          entitlements: {
              get: function(showAll, ssoUserName) {
                  var deferred = $q.defer();
                  return deferred.promise;
              }
          },
          solutions: {
              get: function(showAll, ssoUserName) {
                  var deferred = $q.defer();
                  return deferred.promise;
              }
          },
          problems: function (params) {
              var deferred = $q.defer();
              return deferred.promise;
          }
        };                 
    }
  ]);