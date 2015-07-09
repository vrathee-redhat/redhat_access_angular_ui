'use strict';
angular.module('RedhatAccess.cases').directive('rhaAttachfile', function () {
    return {
        templateUrl: 'ascension/views/attachLocalFile.html',
        restrict: 'A',
        controller: 'AttachFile',
        scope: { disabled: '=' }
    };
});
