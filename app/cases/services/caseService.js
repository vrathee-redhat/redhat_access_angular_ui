'use strict';

angular.module('RedhatAccessCases')
.service('CaseService',
  function () {
    this.case = {};
    this.versions = [];
    this.products = [];
    this.statuses = [];
    this.severities = [];
    this.account = {};

    /**
     * Add the necessary wrapper objects needed to properly display the data.
     *
     * @param rawCase
     */
    this.defineCase = function(rawCase) {
      rawCase.severity = {'name': rawCase.severity};
      rawCase.status = {'name': rawCase.status};
      rawCase.product = {'name': rawCase.product};
      rawCase.group = {'number': rawCase.folder_number};
      rawCase.type = {'name': rawCase.type};

      this.case = rawCase;
    };

    this.defineAccount = function(account) {
      this.account = account;
    };

    this.clearCase = function() {
      this.case = {};
      this.account = {};
    }

  }
);
