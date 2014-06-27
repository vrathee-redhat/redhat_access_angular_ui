'use strict';

angular.module('RedhatAccess.cases')
  .service('CaseService', [
    'strataService',
    'AlertService',
    'ENTITLEMENTS',
    'RHAUtils',
    'securityService',
    function(strataService, AlertService, ENTITLEMENTS, RHAUtils, securityService) {
      this.
      case = {};
      this.versions = [];
      this.products = [];
      //this.statuses = [];
      this.severities = [];
      this.groups = [];
      this.users = [];
      this.comments = [];

      this.originalNotifiedUsers = [];
      this.updatedNotifiedUsers = [];

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

      this.usersLoading = false;

      /**
       *  Intended to be called only after user is logged in and has account details
       *  See securityService.
       */
      this.populateUsers = angular.bind(this, function () {
        if (securityService.userAllowedToManage()) {
          this.usersLoading = true;

          strataService.accounts.users(securityService.loginStatus.account.number).then(
              angular.bind(this, function(users) {
                this.usersLoading = false;
                this.users = users;
              }),
              angular.bind(this, function(error) {
                this.usersLoading = false;
                this.users = [];
                AlertService.addStrataErrorMessage(error);
              })
          );
        } else {
          this.users = [];
        }
      });

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

      this.showFts = function() {
        if (RHAUtils.isNotEmpty(this.severities) && angular.equals(this.case.severity, this.severities[0])) {
          if (this.entitlement === ENTITLEMENTS.premium ||
              (RHAUtils.isNotEmpty(this.case.entitlement) 
                && this.case.entitlement.sla === ENTITLEMENTS.premium)) {
            return true;
          }
        }
        return false;
      };
    }
  ]);
