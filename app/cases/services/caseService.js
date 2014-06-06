'use strict';

angular.module('RedhatAccess.cases')
  .service('CaseService', [
    'strataService',
    function(strataService) {
      this.
      case = {};
      this.versions = [];
      this.products = [];
      //this.statuses = [];
      this.severities = [];
      this.groups = [];
      this.owners = [];

      this.account = {};

      this.status;
      this.severity;
      this.type;
      this.group;
      this.owner;
      this.product;
      /**
       * Add the necessary wrapper objects needed to properly display the data.
       *
       * @param rawCase
       */
      this.defineCase = function(rawCase) {
        /*jshint camelcase: false */
        rawCase.severity = {
          'name': rawCase.severity
        };
        rawCase.status = {
          'name': rawCase.status
        };
        rawCase.product = {
          'name': rawCase.product
        };
        rawCase.group = {
          'number': rawCase.folder_number
        };
        rawCase.type = {
          'name': rawCase.type
        };

        this.
        case = rawCase;
      };

      this.defineAccount = function(account) {
        this.account = account;
      };

      this.clearCase = function() {
        this.
        case = {};

        this.versions = [];
        this.products = [];
        this.statuses = [];
        this.severities = [];
        this.groups = [];
        this.account = {};

        this.status = undefined;
        this.severity = undefined;
        this.type = undefined;
        this.group = undefined;
        this.owner = undefined;
        this.product = undefined;
      };

      this.populateGroups = function() {
        strataService.groups.list().then(
          angular.bind(this, function(groups) {
            this.groups = groups;
          })
        );
      };
    }
  ]);
