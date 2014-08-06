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
        var compileFn = compileService(' <div rha-listbugzillas/>');
        var element = compileFn(mockScope);
        securityService.loginStatus.isInternal = true;
        mockScope.securityService = securityService;
        mockScope.$root.$digest();
        expect(element.find('.redhat-access-bz').length).toBe(1);        
    });

    it('should not display the linked bugzilla section for customer', function() {
        var compileFn = compileService(' <div rha-listbugzillas/>');
        var element = compileFn(mockScope);
        securityService.loginStatus.isInternal = false;
        mockScope.securityService = securityService;
        mockScope.$root.$digest();
        expect(element.find('.redhat-access-bz.ng-hide').length).toBe(1);        
    });


});