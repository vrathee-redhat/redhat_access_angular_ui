'use strict';

describe('Case Directives', function () {
    var mockScope;
    var compileService;
    var mockStrataDataService;
    var securityService;
    var caseService;
    var recommendationsService;
    var attachmentsService;
    
    beforeEach(angular.mock.module('RedhatAccess.cases'));
    beforeEach(angular.mock.module('RedhatAccess.mock'));
    
    beforeEach(angular.mock.inject(function ($rootScope, $compile) {
        mockScope = $rootScope.$new();
        compileService = $compile;
    }));
    beforeEach(function () {
        inject(function ($injector, _MockStrataDataService_, _RecommendationsService_, _AttachmentsService_, _CaseService_) {
            securityService = $injector.get('securityService');
            mockStrataDataService = _MockStrataDataService_;
            recommendationsService = _RecommendationsService_;
            attachmentsService = _AttachmentsService_;
            caseService = _CaseService_;
        });
    });
    //Suite for listBugzillas
    describe('listBugzillas', function () {
        it('should display the linked bugzilla section for internal user', function () {
            var compileFn = compileService(' <div rha-listbugzillas/>');
            var element = compileFn(mockScope);
            securityService.loginStatus.authedUser.is_internal = true;
            mockScope.securityService = securityService;
            mockScope.$root.$digest();
           // expect(element.find('.redhat-access-bz').length).toBe(1);
        });
        it('should not display the linked bugzilla section for customer', function () {
            var compileFn = compileService(' <div rha-listbugzillas/>');
            var element = compileFn(mockScope);
            securityService.loginStatus.authedUser.is_internal = false;
            mockScope.securityService = securityService;
            mockScope.$root.$digest();
          //  expect(element.find('.redhat-access-bz.ng-hide').length).toBe(1);
        });
    });
    // ////Suite for detailsSection
    // //describe('detailsSection', function () {
    // //    it('should display the accNo and Name details for internal user', function () {
    // //        var compileFn = compileService(' <div rha-casedetails/>');
    // //        var element = compileFn(mockScope);
    // //        securityService.loginStatus.authedUser.is_internal = true;
    // //        mockScope.securityService = securityService;
    // //        mockScope.$root.$digest();
    // //        expect(element.find('.rha-detail-acc-name').length).toBe(1);
    // //        expect(element.find('.rha-detail-acc-number').length).toBe(1);
    // //    });
    // //    it('should not display the accNo and Name details for customer', function () {
    // //        var compileFn = compileService(' <div rha-casedetails/>');
    // //        var element = compileFn(mockScope);
    // //        securityService.loginStatus.authedUser.is_internal = false;
    // //        mockScope.securityService = securityService;
    // //        mockScope.$root.$digest();
    // //        expect(element.find('.rha-detail-acc-name').length).toBe(0);
    // //        expect(element.find('.rha-detail-acc-number').length).toBe(0);
    // //    });
    // //});
    // //Suite for recommendationsSection
    // describe('recommendationsSection', function () {
    //     xit('should display spinner when recommendations are loading', function () {
    //         var compileFn = compileService(' <div rha-caserecommendations/>');
    //         var element = compileFn(mockScope);
    //         recommendationsService.loadingRecommendations = true;
    //         mockScope.RecommendationsService = recommendationsService;
    //         mockScope.$root.$digest();
    //         expect(element.find('.rha-search-spinner-sm').length).toBe(1);
    //     });
    //     xit('should not display spinner when recommendations have loaded', function () {
    //         var compileFn = compileService(' <div rha-caserecommendations/>');
    //         var element = compileFn(mockScope);
    //         recommendationsService.loadingRecommBugzillasendations = false;
    //         mockScope.RecommendationsService = recommendationsService;
    //         mockScope.$root.$digest();
    //         expect(element.find('.rha-search-spinner-sm.ng-hide').length).toBe(1);
    //     });
    //     xit('should have the correct pinned class', function () {
    //         var compileFn = compileService(' <div rha-caserecommendations/>');
    //         var element = compileFn(mockScope);
    //         mockScope.recommendationsOnScreen = [];
    //         mockScope.RecommendationsService = recommendationsService;
    //         mockScope.$root.$digest();
    //         expect(element.find('.pagination-sm').length).toBe(1);
    //     });
    // });
    // //Suite for listAttachments
    // describe('listAttachments', function () {
    //     it('should display the no attachments div when list is empty', function () {
    //         var compileFn = compileService(' <div rha-listattachments/>');
    //         var element = compileFn(mockScope);
    //         attachmentsService.originalAttachments = [];
    //         mockScope.AttachmentsService = attachmentsService;
    //         mockScope.$root.$digest();
    //         expect(element.find('.rha-attachments-section').length).toBe(1);
    //         expect(element.find('.rha-attachments-section').text()).toEqual('No attachments added');
    //     });
    //     it('should not display the no attachments div when attachments present', function () {
    //         var compileFn = compileService(' <div rha-listattachments/>');
    //         var element = compileFn(mockScope);
    //         attachmentsService.originalAttachments = mockStrataDataService.mockAttachments;
    //         mockScope.AttachmentsService = attachmentsService;
    //         mockScope.$root.$digest();
    //         expect(element.find('.rha-attachments-section.ng-hide').length).toBe(1);
    //     });
    // });
    // //Suite for commentsSection
    // describe('commentsSection', function () {
    //     //TODO commented out for IE8 test
    //     // it('should display the comments section when comments present', function () {
    //     //     var compileFn = compileService(' <div rha-casecomments/>');
    //     //     var element = compileFn(mockScope);
    //     //     caseService.comments = mockStrataDataService.mockComments;
    //     //     mockScope.CaseService = caseService;
    //     //     mockScope.$root.$digest();
    //     //     expect(element.find('.rha-comments-section').length).toBe(1);
    //     //     expect(element.find('.rha-comment-text .pcmTextBlock').text()).toEqual(mockStrataDataService.mockComments[0].text);
    //     // });
    //     it('should not display the comments section when no comments available', function () {
    //         var compileFn = compileService(' <div rha-casecomments/>');
    //         var element = compileFn(mockScope);
    //         caseService.comments = [];
    //         mockScope.CaseService = caseService;
    //         mockScope.$root.$digest();
    //         expect(element.find('.rha-comments-section.ng-show').length).toBe(0);
    //     });
    // });
    // //Suite for addCommentSection
    // describe('addCommentSection', function () {
    //     xit('should not display the comments section when no comments available', function () {
    //         var compileFn = compileService(' <div rha-addcommentsection/>');
    //         var element = compileFn(mockScope);
    //         caseService.commentText = 'hello';
    //         mockScope.CaseService = caseService;
    //         mockScope.addingComment = true;
    //         mockScope.$root.$digest();
    //      //   expect(element.find('.form-control').val()).toEqual('hello');
    //     });
    // });
});
