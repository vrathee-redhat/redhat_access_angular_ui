'use strict';

angular.module('RedhatAccess.cases')
  .service('CaseService', [
    'strataService',
    'AlertService',
    'ENTITLEMENTS',
    'RHAUtils',
    'securityService',
    '$q',
    '$filter',
    function(strataService, AlertService, ENTITLEMENTS, RHAUtils, securityService, $q, $filter) {
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
      this.bugzillaList = {};

      this.onSelectChanged = null;
      this.onOwnerSelectChanged = null;
      this.onGroupSelectChanged = null;
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

        this.bugzillaList = rawCase.bugzillas;

      };

      this.defineAccount = function(account) {
        this.account = account;
      };

      this.defineNotifiedUsers = function() {
        /*jshint camelcase: false */
        this.updatedNotifiedUsers.push(this.
          case.contact_sso_username);

        //hide the X button for the case owner
        $('#rha-email-notify-select').on('change', angular.bind(this, function() {
          $('x-rha-email-notify-select .select2-choices li:contains("' + this.
            case.contact_sso_username + '") a').css('display', 'none');
          $('x-rha-email-notify-select .select2-choices li:contains("' + this.
            case.contact_sso_username + '")').css('padding-left', '5px');
        }));

        if (RHAUtils.isNotEmpty(this.
            case.notified_users)) {

          angular.forEach(this.
              case.notified_users.link,
            angular.bind(this, function(user) {
              this.originalNotifiedUsers.push(user.sso_username);
            })
          );
          this.updatedNotifiedUsers =
            this.updatedNotifiedUsers.concat(this.originalNotifiedUsers);
        }
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
        this.bugzillaList = {};

        this.draftComment = undefined;
        this.commentText = undefined;
        this.status = undefined;
        this.severity = undefined;
        this.type = undefined;
        this.group = undefined;
        this.owner = undefined;
        this.product = undefined;
      };

      this.groupsLoading = false;

      this.populateGroups = function(ssoUsername) {
        this.groupsLoading = true;
        strataService.groups.list(ssoUsername).then(
          angular.bind(this, function(groups) {
            this.groups = groups;
            this.groupsLoading = false;
          }),
          angular.bind(this, function(error) {
            this.groupsLoading = false;
            AlertService.addStrataErrorMessage(error);
          })
        );
      };

      this.usersLoading = false;

      /**
       *  Intended to be called only after user is logged in and has account details
       *  See securityService.
       */
      this.populateUsers = angular.bind(this, function () {
        var promise = null;

        if (securityService.loginStatus.orgAdmin) {
          this.usersLoading = true;

          var accountNumber =
            RHAUtils.isEmpty(this.account.number) ?
              securityService.loginStatus.account.number : this.account.number;

          promise = strataService.accounts.users(accountNumber);
          promise.then(
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
          var deferred = $q.defer();
          promise = deferred.promise;
          deferred.resolve();

          this.users = [];
        }

        return promise;
      });

      this.refreshComments = null;

      this.populateComments = function(caseNumber) {
        var promise = strataService.cases.comments.get(caseNumber);

        promise.then(
            angular.bind(this, function(comments) {
              //pull out the draft comment
              angular.forEach(comments, angular.bind(this, function(comment, index) {
                if (comment.draft === true) {
                  this.draftComment = comment;
                  this.commentText = comment.text;
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

      this.entitlementsLoading = false;
      this.populateEntitlements = function(ssoUserName) {
        this.entitlementsLoading = true;
        strataService.entitlements.get(false, ssoUserName).then(
          angular.bind(this, function(entitlementsResponse) {
            // if the user has any premium or standard level entitlement, then allow them
            // to select it, regardless of the product.
            // TODO: strata should respond with a filtered list given a product.
            //       Adding the query param ?product=$PRODUCT does not work.
            var premiumSupport = $filter('filter')(entitlementsResponse.entitlement, {'sla': ENTITLEMENTS.premium});
            var standardSupport = $filter('filter')(entitlementsResponse.entitlement, {'sla': ENTITLEMENTS.standard});

            var entitlements = [];
            if (RHAUtils.isNotEmpty(premiumSupport)) {
              entitlements.push(ENTITLEMENTS.premium);
            }
            if (RHAUtils.isNotEmpty(standardSupport)) {
              entitlements.push(ENTITLEMENTS.standard);
            }

            if (entitlements.length === 0) {
              entitlements.push(ENTITLEMENTS.default);
            }

            this.entitlements = entitlements;
            this.entitlementsLoading = false;
          }),
          angular.bind(this, function(error) {
            AlertService.addStrataErrorMessage(error);
          })
        );
      };

      this.showFts = function() {
        if (RHAUtils.isNotEmpty(this.severities) && angular.equals(this.case.severity, this.severities[0])) {
          if (this.entitlement === ENTITLEMENTS.premium ||
              (RHAUtils.isNotEmpty(this.case.entitlement) &&
               this.case.entitlement.sla === ENTITLEMENTS.premium)) {
            return true;
          }
        }
        return false;
      };

      this.newCasePage1Incomplete = true;
      this.validateNewCasePage1 = function () {
        if (RHAUtils.isEmpty(this.case.product) ||
          RHAUtils.isEmpty(this.case.version) ||
          RHAUtils.isEmpty(this.case.summary) ||
          RHAUtils.isEmpty(this.case.description) ||
          (securityService.loginStatus.isInternal && RHAUtils.isEmpty(this.owner))) {
          this.newCasePage1Incomplete = true;
        } else {
          this.newCasePage1Incomplete = false;
        }
      };
    }
  ]);
