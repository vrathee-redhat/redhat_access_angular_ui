'use strict';
/*jshint camelcase: false */
angular.module('RedhatAccess.cases').service('ManageGroupsService', [    
    'securityService',
    'AlertService',
    'strataService',
    'HeaderService',
    'RHAUtils',
    'translate',
    '$filter',
    function (securityService, AlertService, strataService, HeaderService, RHAUtils, translate, $filter) {
    	this.groupsOnScreen = [];
    	this.usersOnAccount = [];
    	this.selectedGroup = {};
    	this.newGroupName = '';
    	this.groupsLoading = false;
    	this.usersLoading = false;
        this.fetchNewGroupDetails = false;

    	this.fetchAccGroupList = function() {
    		this.groupsLoading = true;
            strataService.groups.list(securityService.loginStatus.authedUser.sso_username, false).then(angular.bind(this, function (groups) {
                this.groupsOnScreen = groups;
                this.sortGroups();
                this.groupsLoading = false;
                if(this.fetchNewGroupDetails) {
                    for(var i = 0; i < this.groupsOnScreen.length; i++) {
                        if(this.groupsOnScreen[i].name === this.newGroupName) {
                            this.fetchGroupDetails(this.groupsOnScreen[i]);
                            this.newGroupName = '';
                            this.fetchNewGroupDetails = false;
                            break;
                        }
                    }                                        
                } else {
                    this.fetchGroupDetails(this.groupsOnScreen[0]);
                }                
            }), function (error) {
                AlertService.addStrataErrorMessage(error);
            });
    	};

    	this.fetchGroupDetails = function(group) {
            this.usersLoading = true;
            strataService.groups.get(group.number, securityService.loginStatus.authedUser.sso_username).then(angular.bind(this, function (group) {
                this.selectedGroup = group;
                this.fetchAccUsers(this.selectedGroup);
            }), function (error) {
                AlertService.addStrataErrorMessage(error);
            });	
    	};

    	this.fetchAccUsers = function(group) {
    		strataService.accounts.users(securityService.loginStatus.authedUser.account_number, group.number).then(angular.bind(this, function (users) {
                this.usersOnAccount = users;
                this.manipulateUserAccess();
                this.usersLoading = false;
            }), function (error) {
                AlertService.addStrataErrorMessage(error);
            });
    	};

    	this.saveGroup = function(group,users) {
    		if(group !== undefined){
                AlertService.addWarningMessage(translate('Updating group') + ' ' + group.name + '...');
                strataService.groups.get(group.number, securityService.loginStatus.authedUser.sso_username).then(angular.bind(this, function (detailedGroup) {
                    strataService.groups.update(detailedGroup, securityService.loginStatus.authedUser.sso_username).then(function (response) {
                        AlertService.clearAlerts();
                        AlertService.addSuccessMessage(translate('Case group successfully updated.'));
                    }, function (error) {
                        AlertService.addStrataErrorMessage(error);
                    });                                    
                }), function (error) {
                    AlertService.addStrataErrorMessage(error);
                });                
            }
            if(users !== undefined){
                AlertService.addWarningMessage(translate('Updating users for group...'));
                strataService.groupUsers.update(users, securityService.loginStatus.authedUser.account_number, this.selectedGroup.number).then(function(response) {
                    AlertService.clearAlerts();
                    AlertService.addSuccessMessage(translate('Case users successfully updated.'));
                }, function (error) {
                    AlertService.addStrataErrorMessage(error);
                });
            }
    	};

    	this.deleteGroup = function(group) {
            AlertService.addWarningMessage(translate('Deleting group') + ' ' + group.name + '...');
    		strataService.groups.remove(group.number, securityService.loginStatus.authedUser.sso_username).then(angular.bind(this, function (success) {
                var groups = $filter('filter')(this.groupsOnScreen, function (g) {
                    if (g.number !== group.number) {
                        return true;
                    } else {
                        return false;
                    }
                });
                this.groupsOnScreen = groups;
                this.sortGroups();
                AlertService.clearAlerts();
                AlertService.addSuccessMessage(translate('Successfully deleted group') + ' ' + group.name);
            }), function (error) {
                AlertService.clearAlerts();
                AlertService.addStrataErrorMessage(error);
            });
    	};

    	this.createGroup = function() {
    		AlertService.addWarningMessage(translate('Creating group') + ' ' + this.newGroupName + '...');
            strataService.groups.create(this.newGroupName, securityService.loginStatus.authedUser.sso_username).then(angular.bind(this, function (success) {
                if(success !== null){
                    this.groupsOnScreen.push({
                        name: this.newGroupName,
                        number: success
                    });
                    this.sortGroups();
                    this.newGroupName = '';
                    AlertService.clearAlerts();
                    AlertService.addSuccessMessage(translate('Successfully created group') + ' ' + this.newGroupName);                    
                } else {
                    this.fetchNewGroupDetails = true;
                    this.fetchAccGroupList();
                    AlertService.clearAlerts();
                    AlertService.addSuccessMessage(translate('Successfully created group') + ' ' + this.newGroupName);                    
                }
            }), function (error) {
                AlertService.clearAlerts();
                AlertService.addStrataErrorMessage(error);
            });
    	};

    	this.setDefaultGroup = function(user) {
    		var tmpGroup = {
                name: this.selectedGroup.name,
                number: this.selectedGroup.number,
                isDefault: true,
                contactSsoName: user.sso_username
            };
            user.groupIsdefault = true;
            user.settingDefaultGroup = true;
            strataService.groups.createDefault(tmpGroup).then(function () {                    
                user.settingDefaultGroup = false;
                AlertService.addSuccessMessage('Successfully set ' + tmpGroup.name + ' as ' + user.sso_username + '\'s default group.');
            }, function (error) {
                AlertService.addStrataErrorMessage(error);
            });
    	};

    	this.manipulateUserAccess = function() {
            angular.forEach(this.usersOnAccount, angular.bind(this, function (user) {
                if (user.write === true || user.org_admin === true) {
                    user.permission = 'WRITE';
                } else if (user.access === true && user.write === false) {
                    user.permission = 'READ';
                } else if (user.access === false && user.write === false) {
                    user.permission = 'NONE';
                }
            }));
        };

        this.sortGroups = function() {
            this.groupsOnScreen.sort(function(a, b){
                if(a.name < b.name) { return -1; }
                if(a.name > b.name) { return 1; }
                return 0;
            });
        }; 


    }
]);