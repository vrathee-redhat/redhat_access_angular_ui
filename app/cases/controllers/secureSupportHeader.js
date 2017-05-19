'use strict';

export default class SecureSupportHeader {
    constructor($scope, COMMON_CONFIG) {
        'ngInject';

        $scope.isSecureSupport = function() {
            return COMMON_CONFIG.isGS4;
        }

    }
}
