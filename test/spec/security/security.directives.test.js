'use strict';
describe('Directive for login status', function () {
    var mockScope;
    var compileService;
    var securityService;
    beforeEach(angular.mock.module('RedhatAccess.security'));
    beforeEach(angular.mock.inject(function ($rootScope, $compile) {
        mockScope = $rootScope.$new();
        compileService = $compile;
    }));
    beforeEach(function () {
        inject(function ($injector) {
            securityService = $injector.get('securityService');
        });
    });
    it('should provide a login link when the user is not logged in', function () {
        var compileFn = compileService(' <div rha-loginstatus/>');
        sinon.stub(securityService, 'validateLogin').returns(true);
        var element = compileFn(mockScope);
        mockScope.securityService = securityService;
        mockScope.$digest();
        expect(element.find('.rha-logged-in.ng-hide').length).toBe(1);
        expect(element.find('.rha-logged-out').length).toBe(1);
        expect(element.find('.rha-logged-out.ng-hide').length).toBe(0);
        expect(element.find('span.rha-logged-in a').text()).toBe(' Log Out');
    });
    // it('should provide a logout link when the user is logged in ', function () {
    //     var compileFn = compileService(' <div rha-loginstatus/>');
    //     sinon.stub(securityService, 'validateLogin').returns(true);
    //     securityService.loginStatus = {
    //         isLoggedIn: true,
    //         authedUser: {
    //             loggedInUser: 'John Doe'
    //         },
    //         verifying: false
    //     };
    //     var element = compileFn(mockScope);
    //     mockScope.securityService = securityService;
    //     mockScope.$digest();
    //     expect(element.find('.rha-logged-out.ng-hide').length).toBe(1);
    //     expect(element.find('.rha-logged-in').length).toBe(1);
    //     expect(element.find('.rha-logged-in.ng-hide').length).toBe(0);
    //     expect(element.find('span.rha-logged-out a').text()).toBe(' Log In');
    //     expect(element.find('.rha-logged-in').html()).toContain('John Doe');
    // });
});
