'use strict';

export default class RequestEscalation {
    constructor($scope, $uibModal) {
        'ngInject';

        $scope.requestManagementEscalation = function () {
            $uibModal.open({
                template: require('../views/requestManagementEscalationModal.jade'),
                controller: 'RequestManagementEscalationModal'
            });
        };
    }
}
