'use strict';

angular.module('RedhatAccess.cases')
.service('SearchCaseService', [
  'CaseService',
  'strataService',
  'AlertService',
  'STATUS',
  function (
    CaseService,
    strataService,
    AlertService,
    STATUS) {

    this.cases = [];
    this.searching = false;
    this.searchTerm = '';
    
    var getIncludeClosed = function() {
      if (CaseService.status !== undefined) {
        if (CaseService.status.value === STATUS.open) {
          return false;
        } else if (CaseService.status.value === STATUS.closed) {
          return true;
        } else if (CaseService.status.value === STATUS.both) {
          return true;
        }
      }

      return true;
    };

    this.clear = function() {
      this.cases = [];
      this.searchTerm = '';
    };

    this.doFilter = function() {
      var params = {
        include_closed: getIncludeClosed(),
        count: 100
      };

      if (this.searchTerm !== '') {
        params.keyword = this.searchTerm;
      }

      if (CaseService.group !== undefined) {
        params.group_numbers = {
          group_number: [CaseService.group.number]
        };
      }

      if (CaseService.status !== undefined) {
        if (CaseService.status.value === STATUS.closed) {
          params.status = STATUS.closed;
        }
      }

      if (CaseService.product !== undefined) {
        params.product = CaseService.product.name;
      }

      if (CaseService.owner !== undefined) {
        params.owner_ssoname =  CaseService.owner.sso_username;
      }
      
      if (CaseService.type !== undefined) {
        params.type = CaseService.type.name;
      }

      if (CaseService.severity !== undefined) {
        params.severity = CaseService.severity.name;
      }

      this.searching = true;

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
    };


  }
]);
