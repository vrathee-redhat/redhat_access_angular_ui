'use strict';

angular.module('RedhatAccess.cases')
.service('SearchCaseService', [
  'CaseService',
  'strataService',
  'AlertService',
  'STATUS',
  '$q',
  function (
    CaseService,
    strataService,
    AlertService,
    STATUS,
    $q) {

    this.cases = [];
    this.searching = false;
    this.searchTerm = '';
    
    var getIncludeClosed = function() {
      if (CaseService.status === STATUS.open) {
        return false;
      } else if (CaseService.status === STATUS.closed) {
        return true;
      } else if (CaseService.status === STATUS.both) {
        return true;
      }

      return true;
    };

    this.clear = function() {
      this.cases = [];
      this.searchTerm = '';
    };

    this.oldParams = {};
    this.doFilter = function() {
      var params = {
        include_closed: getIncludeClosed(),
        count: 100
      };

      var isObjectNothing = function(object) {
        if (object === '' || object === undefined || object === null) {
          return true;
        } else {
          return false;
        }
      };

      if (!isObjectNothing(this.searchTerm)) {
        params.keyword = this.searchTerm;
      }

      if (!isObjectNothing(CaseService.group)) {
        params.group_numbers = {
          group_number: CaseService.group
        };
      }

      if (CaseService.status === STATUS.closed) {
        params.status = STATUS.closed;
      }

      if (!isObjectNothing(CaseService.product)) {
        params.product = CaseService.product;
      }

      if (!isObjectNothing(CaseService.owner)) {
        params.owner_ssoname =  CaseService.owner;
      }
      
      if (!isObjectNothing(CaseService.type)) {
        params.type = CaseService.type;
      }

      if (!isObjectNothing(CaseService.severity)) {
        params.severity = CaseService.severity;
      }

      this.searching = true;

      //TODO: hack to get around onchange() firing at page load for each select.
      //Need to prevent initial onchange() event instead of handling here.
      if (!angular.equals(params, this.oldParams)) {
        this.oldParams = params;
        return strataService.cases.filter(params).then(
            angular.bind(this, function(cases) {
              this.cases = cases;
              this.searching = false;
            }),
            angular.bind(this, function(error) {
              AlertService.addStrataErrorMessage(error);
              this.searching = false;
            })
        );
      } else {
        var deferred = $q.defer();
        deferred.resolve();
        return deferred.promise;
      }
    };


  }
]);
