'use strict';
angular.module('RedhatAccess.cases').directive('rhaAttachfile', function () {
    return {
        templateUrl: 'ascension/views/attachFile.html',
        restrict: 'A',
        controller: 'AttachFile',
        scope: { disabled: '=' }
    };
});
