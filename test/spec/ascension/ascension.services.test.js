/*jshint camelcase:false*/
'use strict';
describe('Ascension Services', function () {
    var accountService;
    var caseDetailsService;
    var caseDiscussionService;
    var escalationsService;
    var RoutingService;
    var userDetailsService;
    var mockUDSService;
    var scope;
    var rootScope;
    var q;
    var rhaUtils;
    var securityService;
    var mockStrataService;
    var caseService;
    var mockUDSDataService;


    beforeEach(angular.mock.module('RedhatAccess.cases'));
    beforeEach(angular.mock.module('RedhatAccess.ascension'));
    beforeEach(angular.mock.module('RedhatAccess.mock'));
    beforeEach(angular.mock.module('RedhatAccess.mockUDS'));

    beforeEach(inject(function (_CaseService_,_MockUDSDataService_,_udsService_,_strataService_,_AccountService_, _CaseDetailsService_, _CaseDiscussionService_, _EscalationsService_, _RoutingService_, _UserDetailsService_, $injector, $q, $rootScope) {
        accountService = _AccountService_;
        caseDetailsService = _CaseDetailsService_;
        caseService =_CaseService_;
        caseDiscussionService = _CaseDiscussionService_;
        escalationsService = _EscalationsService_;
        RoutingService = _RoutingService_;
        userDetailsService = _UserDetailsService_;
        scope = $rootScope.$new();
        rootScope = $rootScope;
        securityService = $injector.get('securityService');
        q = $q;
        rhaUtils = $injector.get('RHAUtils');
        mockUDSDataService = _MockUDSDataService_;
        mockStrataService = _strataService_;
        mockUDSService = _udsService_;
    }));

    //Suite for caseDetailsService
    describe('CaseDetailsService', function () {
        it('should have a method for getting case details for given case', function () {
            expect(caseDetailsService.getCaseDetails).toBeDefined();
            expect(caseDetailsService.caseDetailsLoading).toBe(true);
            caseDetailsService.getCaseDetails(1286251);
            spyOn(mockUDSService.kase.details, 'get').andCallThrough();
            scope.$root.$digest();
            expect(caseDetailsService.kase).toEqual(mockUDSDataService.mockCase);
            expect(caseDetailsService.caseDetailsLoading).toBe(false);
        });
        it('should have a method for extracting routing roles for given user', function () {
            expect(caseDetailsService.extractRoutingRoles).toBeDefined();
            var result = caseDetailsService.extractRoutingRoles(mockUDSDataService.mockUser);
            expect(result[0]).toEqual('ascension-fts');
        });
        it('should have a method for getting top cases for loggedin user', function () {
            expect(caseDetailsService.getYourCases).toBeDefined();
            securityService.loginStatus.authedUser.sso_username = 'testUser';
            caseDetailsService.getYourCases();
            spyOn(mockUDSService.cases, 'list').andCallThrough();
            scope.$root.$digest();
            expect(caseDetailsService.cases).toEqual(mockUDSDataService.yourCases);
        });
        it('should have a method for fetching case history', function () {
            expect(caseDetailsService.fetCaseHistory).toBeDefined();
            caseDetailsService.fetCaseHistory(1286251);
            spyOn(mockUDSService.kase.history, 'get').andCallThrough();
            scope.$root.$digest();
            expect(caseDetailsService.caseHistory).toEqual(mockUDSDataService.mockCaseHistory);
        });

    });

    //Suite for AccountService
    describe('AccountService', function () {
        it('should have a method for getting account details for loggedin user', function () {
            expect(accountService.getAccountDetails).toBeDefined();
            rhaUtils.userTimeZone="America/New_York";
            accountService.getAccountDetails(651570);
            spyOn(mockUDSService.account, 'get').andCallThrough();
            scope.$root.$digest();
            expect(accountService.account).toEqual(mockUDSDataService.mockAccount);
            expect(accountService.account.resource.businessHours.resource.businessHoursTooltip).toEqual("Monday Start Time: 04:00:00 AM<br/>Monday End Time: 01:00:00 PM<br/>Tuesday Start Time: 04:00:00 AM<br/>Tuesday End Time: 01:00:00 PM<br/>Wednesday Start Time: 04:00:00 AM<br/>Wednesday End Time: 01:00:00 PM<br/>Thursday Start Time: 04:00:00 AM<br/>Thursday End Time: 01:00:00 PM<br/>Friday Start Time: 04:00:00 AM<br/>Friday End Time: 01:00:00 PM<br/>");
        });
    });

    //Suite for CaseDiscussionService
    describe('CaseDiscussionService', function () {
        it('should have a method for getting discussion elements for given case number', function () {
            expect(caseDiscussionService.getDiscussionElements).toBeDefined();
            caseDiscussionService.getDiscussionElements(1286251);
            spyOn(mockUDSService.kase.comments, 'get').andCallThrough();
            scope.$root.$digest();
           // expect(caseDiscussionService.discussionElements).toEqual(mockUDSDataService.mockCaseComments);
        });
    });

});
