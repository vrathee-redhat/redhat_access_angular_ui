'use strict';

angular.module('RedhatAccess.cases')
  .service('CaseService', [
    'strataService',
    'AlertService',
    function(strataService, AlertService) {
      this.
      case = {};
      this.versions = [];
      this.products = [];
      //this.statuses = [];
      this.severities = [];
      this.groups = [];
      this.owners = [];
      this.comments = [];

      this.account = {};

      this.draftComment = '';
      this.commentText = '';
      this.status = '';
      this.severity = '';
      this.type = '';
      this.group = '';
      this.owner = '';
      this.product = '';

      this.onSelectChanged;
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

      this.getGroups = function() {
        return this.groups;
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
        this.comments = [];

        this.draftComment = undefined;
        this.commentText = undefined;
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

      this.refreshComments;

      this.populateComments = function(case_number) {
        var promise = strataService.cases.comments.get(case_number);

        promise.then(
            angular.bind(this, function(comments) {
              //pull out the draft comment
              angular.forEach(comments, angular.bind(this, function(comment, index) {
                if (comment.draft === true) {
                  this.draftComment = comment;
                  this.commentText = comment.text
                  comments.slice(index, index + 1);
                }
              }));

              this.comments = comments;
            }),
            function(error) {
              AlertService.addStrataErrorMessage(error);
            }
        );

        return promise;
      };
    }
  ]);
