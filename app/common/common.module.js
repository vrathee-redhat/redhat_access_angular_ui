/*global angular */
'use strict';
/*global $ */
angular.module('RedhatAccess.common', [
    'RedhatAccess.ui-utils',
    'jmdobry.angular-cache'
]).config(function ($angularCacheFactoryProvider) {
}).constant('RESOURCE_TYPES', {
    article: 'Article',
    solution: 'Solution'
});