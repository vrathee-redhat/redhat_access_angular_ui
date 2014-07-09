'use strict';

describe('Case Directives', function() {

	var mockScope;
    var compileService;
    var securityService;


    beforeEach(angular.mock.module('RedhatAccess.cases'));
    beforeEach(angular.mock.inject(function($rootScope, $compile) {
        mockScope = $rootScope.$new();
        compileService = $compile;
    }));

    beforeEach(function() {
        inject(function($injector) {
            securityService = $injector.get('securityService');
        })
    });

    it('should display the linked bugzilla section for internal user', function() {
        var compileFn = compileService(' <rha-list-bugzillas/>');
        var element = compileFn(mockScope);
        securityService.loginStatus.isInternal = true;
        mockScope.securityService = securityService;
        mockScope.$digest();
        expect(element.find('.redhat-access-bz').length).toBe(1);        
    });


});