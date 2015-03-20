'use strict';
/*jshint camelcase: false */
angular.module('RedhatAccess.cases').controller('DetailsSection', [
    '$scope',
    'strataService',
    'CaseService',
    'securityService',
    'ProductsService',
    '$rootScope',
    'AUTH_EVENTS',
    'CASE_EVENTS',
    'AlertService',
    'RHAUtils',
    function ($scope, strataService, CaseService, securityService, ProductsService, $rootScope, AUTH_EVENTS, CASE_EVENTS, AlertService, RHAUtils) {
        $scope.showExtraInfo = false;
	    $scope.CaseService = CaseService;
        $scope.securityService = securityService;
        $scope.maxNotesLength = '255';
        $scope.progressCount = 0;

		$scope.toggleExtraInfo = function() {
			$scope.showExtraInfo = !$scope.showExtraInfo;

		}

        $scope.resetData = function(){
            CaseService.resetCase();
            ProductsService.getVersions(CaseService.kase.product);
            $scope.detailsForm.$setPristine();
        }

        $scope.init = function () {
            if (!$scope.compact) {
                strataService.values.cases.types().then(function (response) {
                    $scope.caseTypes = response;
                }, function (error) {
                    AlertService.addStrataErrorMessage(error);
                });
                strataService.groups.list(securityService.loginStatus.authedUser.sso_username).then(function (response) {
                    $scope.groups = response;
                }, function (error) {
                    AlertService.addStrataErrorMessage(error);
                });
            }
            strataService.values.cases.status().then(function (response) {
                CaseService.statuses = response;
            }, function (error) {
                AlertService.addStrataErrorMessage(error);
            });
            strataService.values.cases.severity().then(function (response) {
                CaseService.severities = response;
            }, function (error) {
                AlertService.addStrataErrorMessage(error);
            });
            ProductsService.getProducts(false);
            $scope.userIsCaseOwner = true;
            var ownerOptions = [];
            //Assuming the full name matches the owner name, strata does not support getting that through case object
            var fullName = securityService.loginStatus.authedUser.first_name+' '+securityService.loginStatus.authedUser.last_name;
            if (fullName !== CaseService.kase.owner && securityService.loginStatus.authedUser.is_internal){
                $scope.userIsCaseOwner = false;
                ownerOptions.push({
                    value: securityService.loginStatus.authedUser.sso_username,
                    label: fullName
                },{
                    value: CaseService.kase.owner,
                    label: CaseService.kase.owner
                });
            }
            $scope.owners = ownerOptions;
        };


        $scope.$watch('CaseService.kase.notes', function() {
            $scope.maxCharacterCheck();
        });
        $scope.maxCharacterCheck = function() {

            if (CaseService.kase.notes !== undefined ) {

                $scope.progressCount = CaseService.kase.notes.length;
            }
        };

        $scope.updatingDetails = false;
        $scope.updateCase = function () {
            $scope.updatingDetails = true;
            var caseJSON = {};
            //if ($scope.caseDetailsChanged() === true) {
                if (CaseService.kase !== undefined) {
                    if (CaseService.kase.type !== undefined) {
                        caseJSON.type = CaseService.kase.type.name;
                    }
                    if (CaseService.kase.severity !== undefined) {
                        caseJSON.severity = CaseService.kase.severity.name;
                    }
                    if (CaseService.kase.status !== undefined) {
                        caseJSON.status = CaseService.kase.status.name;
                    }
                    if (CaseService.kase.alternate_id !== undefined) {
                        caseJSON.alternateId = CaseService.kase.alternate_id;
                    }
                    if (CaseService.kase.product !== undefined) {
                        caseJSON.product = CaseService.kase.product;
                    }
                    if (CaseService.kase.version !== undefined) {
                        caseJSON.version = CaseService.kase.version;
                    }
                    if (CaseService.kase.group !== null && CaseService.kase.group !== undefined && CaseService.kase.group.number !== undefined) {
                        caseJSON.folderNumber = CaseService.kase.group.number;
                    } else {
                        caseJSON.folderNumber = '';
                    }
                    if (RHAUtils.isNotEmpty(CaseService.kase.fts)) {
                        caseJSON.fts = CaseService.kase.fts;
                        if (!CaseService.kase.fts) {
                            caseJSON.contactInfo24X7 = '';
                        }
                    }
                    if (CaseService.kase.fts) {
                        caseJSON.contactInfo24X7 = CaseService.kase.contact_info24_x7;
                    }
                    if (CaseService.kase.notes !== null) {
                        caseJSON.notes = CaseService.kase.notes;
                    }
                    strataService.cases.put(CaseService.kase.case_number, caseJSON).then(function () {
                        // if ($scope.caseDetails.owner !== undefined && $scope.caseDetails.owner.$dirty) {
                        //     $scope.changeCaseOwner();
                        // }
                        //$scope.caseDetails.$setPristine();
                        $scope.updatingDetails = false;
                        if ($scope.$root.$$phase !== '$apply' && $scope.$root.$$phase !== '$digest') {
                            $scope.$apply();
                        }
                        //TODO move into service
                        angular.copy(CaseService.kase, CaseService.prestineKase);
                        $scope.detailsForm.$setPristine();
                    }, function (error) {
                        // if ($scope.caseDetails.owner !== undefined && $scope.caseDetails.owner.$dirty) {
                        //     $scope.changeCaseOwner();
                        // }
                        AlertService.addStrataErrorMessage(error);
                        $scope.updatingDetails = false;
                        if ($scope.$root.$$phase !== '$apply' && $scope.$root.$$phase !== '$digest') {
                            $scope.$apply();
                        }
                    });
                }
            // } else {
            //     if ($scope.caseDetails.owner !== undefined && $scope.caseDetails.owner.$dirty) {
            //         $scope.changeCaseOwner();
            //     }
            // }
        };
        $scope.changeCaseOwner = function () {
            strataService.cases.owner.update(CaseService.kase.case_number,CaseService.kase.owner).then(function () {
                CaseService.kase.owner = securityService.loginStatus.authedUser.first_name+' '+securityService.loginStatus.authedUser.last_name;
                $scope.userIsCaseOwner = true;
                $scope.updatingDetails = false;
                $scope.caseDetails.$setPristine();
                if ($scope.$root.$$phase !== '$apply' && $scope.$root.$$phase !== '$digest') {
                    $scope.$apply();
                }
            }, function (error) {
                $scope.updatingDetails = false;
                AlertService.addStrataErrorMessage(error);
            });
        };
        $scope.caseDetailsChanged = function () {
            if ($scope.caseDetails.alternate_id.$dirty || $scope.caseDetails.product.$dirty
                    || $scope.caseDetails.version.$dirty || $scope.caseDetails.group.$dirty) {
                return true;
            } else {
                return false;
            }
        };
        if (CaseService.caseDataReady) {
            $scope.init();
        }
        $scope.caseEventDeregister = $rootScope.$on(CASE_EVENTS.received, function () {
            $scope.init();
            //AlertService.clearAlerts();
        });
        $scope.$on('$destroy', function () {
            $scope.caseEventDeregister();
        });
    }
]);
