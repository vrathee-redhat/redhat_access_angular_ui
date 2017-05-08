'use strict';

export default class SecureSupportHeader {
    constructor($scope, securityService) {
        'ngInject';

        $scope.isSecureSupport = function() {
            return securityService.loginStatus.authedUser ? securityService.loginStatus.authedUser.is_internal && securityService.loginStatus.authedUser.is_secure_support_tech : false;
        }

    }
}
