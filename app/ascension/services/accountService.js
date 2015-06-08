'use strict';
/*jshint camelcase: false */
angular.module('RedhatAccess.ascension').service('AccountService', [
    'udsService',
    'AlertService',
    'securityService',
    'RHAUtils',
    'translate',
    function (udsService, AlertService,securityService,RHAUtils,translate) {
        this.accountDetailsLoading = true;
        this.accountNotesLoading = true;
        this.account = {};
        this.cases = {};

        this.getAccountDetails = function(accountNumber) {
            this.accountDetailsLoading = true;
            udsService.account.get(accountNumber).then(angular.bind(this, function (response) {
                this.account = response;
                var businessHoursTooltip="";
                if(this.account && this.account.resource.businessHours) {
                    businessHoursTooltip=businessHoursTooltip.concat(translate("Monday Start Time: "));
                    businessHoursTooltip=businessHoursTooltip.concat(RHAUtils.formatDate(RHAUtils.convertToTimezone(this.account.resource.businessHours.resource.mondayStartTime), 'hh:mm:ss A'));
                    businessHoursTooltip=businessHoursTooltip.concat("<br/>")
                    businessHoursTooltip=businessHoursTooltip.concat(translate("Monday End Time: "));
                    businessHoursTooltip=businessHoursTooltip.concat(RHAUtils.formatDate(RHAUtils.convertToTimezone(this.account.resource.businessHours.resource.mondayEndTime), 'hh:mm:ss A'));
                    businessHoursTooltip=businessHoursTooltip.concat("<br/>")
                    businessHoursTooltip=businessHoursTooltip.concat(translate("Tuesday Start Time: "));
                    businessHoursTooltip=businessHoursTooltip.concat(RHAUtils.formatDate(RHAUtils.convertToTimezone(this.account.resource.businessHours.resource.tuesdayStartTime), 'hh:mm:ss A'));
                    businessHoursTooltip=businessHoursTooltip.concat("<br/>")
                    businessHoursTooltip=businessHoursTooltip.concat(translate("Tuesday End Time: "));
                    businessHoursTooltip=businessHoursTooltip.concat(RHAUtils.formatDate(RHAUtils.convertToTimezone(this.account.resource.businessHours.resource.tuesdayEndTime), 'hh:mm:ss A'));
                    businessHoursTooltip=businessHoursTooltip.concat("<br/>")
                    businessHoursTooltip=businessHoursTooltip.concat(translate("Wednesday Start Time: "));
                    businessHoursTooltip=businessHoursTooltip.concat(RHAUtils.formatDate(RHAUtils.convertToTimezone(this.account.resource.businessHours.resource.wednesdayStartTime), 'hh:mm:ss A'));
                    businessHoursTooltip=businessHoursTooltip.concat("<br/>")
                    businessHoursTooltip=businessHoursTooltip.concat(translate("Wednesday End Time: "));
                    businessHoursTooltip=businessHoursTooltip.concat(RHAUtils.formatDate(RHAUtils.convertToTimezone(this.account.resource.businessHours.resource.wednesdayEndTime), 'hh:mm:ss A'));
                    businessHoursTooltip=businessHoursTooltip.concat("<br/>")
                    businessHoursTooltip=businessHoursTooltip.concat(translate("Thursday Start Time: "));
                    businessHoursTooltip=businessHoursTooltip.concat(RHAUtils.formatDate(RHAUtils.convertToTimezone(this.account.resource.businessHours.resource.thursdayStartTime), 'hh:mm:ss A'));
                    businessHoursTooltip=businessHoursTooltip.concat("<br/>")
                    businessHoursTooltip=businessHoursTooltip.concat(translate("Thursday End Time: "));
                    businessHoursTooltip=businessHoursTooltip.concat(RHAUtils.formatDate(RHAUtils.convertToTimezone(this.account.resource.businessHours.resource.thursdayEndTime), 'hh:mm:ss A'));
                    businessHoursTooltip=businessHoursTooltip.concat("<br/>")
                    businessHoursTooltip=businessHoursTooltip.concat(translate("Friday Start Time: "));
                    businessHoursTooltip=businessHoursTooltip.concat(RHAUtils.formatDate(RHAUtils.convertToTimezone(this.account.resource.businessHours.resource.fridayStartTime), 'hh:mm:ss A'));
                    businessHoursTooltip=businessHoursTooltip.concat("<br/>")
                    businessHoursTooltip=businessHoursTooltip.concat(translate("Friday End Time: "));
                    businessHoursTooltip=businessHoursTooltip.concat(RHAUtils.formatDate(RHAUtils.convertToTimezone(this.account.resource.businessHours.resource.fridayEndTime), 'hh:mm:ss A'));
                    businessHoursTooltip=businessHoursTooltip.concat("<br/>");
                }
               this.account.resource.businessHours.resource.businessHoursTooltip=businessHoursTooltip;
                if(this.account.resource.hasTAM===true)
                {
                    var accountAssociates=this.account.resource.accountAssociates;
                    var TAMnames=[];

                    for(var i=0;i<accountAssociates.length;i++)
                    {
                        if(accountAssociates[i].resource.role==="TAM")
                        {
                            if(accountAssociates[i].resource.associate)
                            {
                            TAMnames.push(accountAssociates[i].resource.associate.resource.fullName);
                            }

                        }

                    }

                }
                this.account.TAM_names=TAMnames;
                this.accountDetailsLoading = false;
            }), angular.bind(this, function (error) {
                AlertService.addStrataErrorMessage(error);
                this.accountDetailsLoading = false;
            }));
        };

        this.getAccountNotes = function(accountNumber) {
            this.accountNotesLoading = true;
            udsService.account.notes(accountNumber).then(angular.bind(this, function (response) {
                this.account.notes = response;
                this.accountNotesLoading = false;
            }), angular.bind(this, function (error) {
                //do not throw error in case notes are not present
                this.accountNotesLoading = false;
            }));
        };
	}
]);
