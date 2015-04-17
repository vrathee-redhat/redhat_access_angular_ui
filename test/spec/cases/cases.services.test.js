/*jshint camelcase:false*/
'use strict';
describe('Case Services', function () {
    var caseService;
    var searchCaseService;
    var securityService;
    var searchBoxService;
    var recommendationsService;
    var caseListService;
    var attachmentsService;
    var groupService;
    var groupUserService;
    var scope;
    var rootScope;
    var q;
    var mockStrataService;
    var mockStrataDataService;
    var mockTreeViewSelectorUtils;
    var rhaUtils;
    var productsService;
    var discussionService;
    beforeEach(angular.mock.module('RedhatAccess.cases'));
    beforeEach(angular.mock.module('RedhatAccess.mock'));
    beforeEach(inject(function (_CaseService_, _SearchCaseService_, _MockStrataDataService_, _strataService_, _SearchBoxService_, _RecommendationsService_, _CaseListService_, _AttachmentsService_, _GroupService_,_GroupUserService_,_TreeViewSelectorUtils_, $injector, $q, $rootScope,_ProductsService_,_DiscussionService_){
        caseService = _CaseService_;
        searchCaseService = _SearchCaseService_;
        mockStrataDataService = _MockStrataDataService_;
        mockStrataService = _strataService_;
        searchBoxService = _SearchBoxService_;
        recommendationsService = _RecommendationsService_;
        attachmentsService = _AttachmentsService_;
        caseListService = _CaseListService_;
        groupService = _GroupService_;
        groupUserService = _GroupUserService_;
        mockTreeViewSelectorUtils = _TreeViewSelectorUtils_;
        productsService = _ProductsService_;
        discussionService=_DiscussionService_;
        scope = $rootScope.$new();
        rootScope = $rootScope;
        securityService = $injector.get('securityService');
        q = $q;
        rhaUtils=$injector.get('RHAUtils');
    }));
    //Suite for CaseService
    describe('CaseService', function () {
        it('should have a method for defining case object', function () {
            expect(caseService.defineCase).toBeDefined();
            var rawCase = {
                    severity: '1',
                    status: 'closed',
                    product: 'Red Hat Enterprise Linux',
                    folder_number: '1234',
                    type: 'bug'
                };
            caseService.defineCase(rawCase);
            expect(caseService.kase.product).toEqual('Red Hat Enterprise Linux');
            expect(caseService.kase.status.name).toEqual('closed');
            expect(caseService.kase.group.number).toEqual('1234');
        });
        it('should have a method to define account', function () {
            expect(caseService.defineAccount).toBeDefined();
            caseService.defineAccount(mockStrataDataService.mockAccount);
            expect(caseService.account).toEqual(mockStrataDataService.mockAccount);
        });
        it('should have a method for populating Case Groups resolved', function () {
            expect(caseService.populateGroups).toBeDefined();
            var ssoUsername = 'testUser';
            caseService.populateGroups(ssoUsername);
            spyOn(mockStrataService.groups, 'list').andCallThrough();
            scope.$root.$digest();
            expect(caseService.groups).toEqual(mockStrataDataService.mockGroups);
            expect(caseService.groupsLoading).toBe(false);
        });
        it('should have a method for populating Case Groups rejected', function () {
            expect(caseService.populateGroups).toBeDefined();
            var ssoUsername = 'testUser';
            mockStrataService.rejectCalls();
            spyOn(mockStrataService.groups, 'list').andCallThrough();
            caseService.populateGroups(ssoUsername, false);
            scope.$root.$digest();
            expect(mockStrataService.groups.list).toHaveBeenCalledWith('testUser', false);
            expect(caseService.groups).toEqual([]);
            expect(caseService.groupsLoading).toBe(false);
        });
        it('should have a method for populating Users For An Account resolved', function () {
            expect(caseService.populateUsers).toBeDefined();
            securityService.loginStatus.authedUser.org_admin = true;
            caseService.account.number = '540155';
            caseService.populateUsers();
            spyOn(mockStrataService.accounts, 'users').andCallThrough();
            scope.$root.$digest();
            expect(caseService.users).toEqual(mockStrataDataService.mockUsers);
            expect(caseService.usersLoading).toBe(false);
        });
        it('should have a method for populating Users For An Account non org admin', function () {
            expect(caseService.populateUsers).toBeDefined();
            securityService.loginStatus.authedUser.org_admin = false;
            caseService.account.number = '540155';
            caseService.populateUsers();
            expect(caseService.users).toEqual([{'sso_username' : undefined}]);
            expect(caseService.usersLoading).toBe(false);
        });
        it('should have a method for populating Users For An Account rejected', function () {
            expect(caseService.populateUsers).toBeDefined();
            securityService.loginStatus.authedUser.org_admin = true;
            caseService.account.number = '540155';
            mockStrataService.rejectCalls();
            spyOn(mockStrataService.accounts, 'users').andCallThrough();
            caseService.populateUsers();
            scope.$root.$digest();
            expect(mockStrataService.accounts.users).toHaveBeenCalledWith('540155');
            expect(caseService.users).toEqual([]);
            expect(caseService.usersLoading).toBe(false);
        });
        it('should have a method for populating Case Comments resolved', function () {
            expect(caseService.populateComments).toBeDefined();
            var caseNumber = '12345';
            caseService.populateComments(caseNumber);
            spyOn(mockStrataService.cases.comments, 'get').andCallThrough();
            scope.$root.$digest();
            expect(caseService.comments).toEqual(mockStrataDataService.mockComments);
        });
        it('should have a method for populating Case Comments rejected', function () {
            expect(caseService.populateComments).toBeDefined();
            var caseNumber = '12345';
            mockStrataService.rejectCalls();
            spyOn(mockStrataService.cases.comments, 'get').andCallThrough();
            caseService.populateComments(caseNumber);
            scope.$root.$digest();
            expect(mockStrataService.cases.comments.get).toHaveBeenCalledWith('12345');
            expect(caseService.comments).toEqual([]);
        });
        it('should have a method for populating User Entitlements rejected', function () {
            expect(caseService.populateEntitlements).toBeDefined();
            var ssoUsername = 'testUser';
            mockStrataService.rejectCalls();
            spyOn(mockStrataService.entitlements, 'get').andCallThrough();
            caseService.populateEntitlements(ssoUsername);
            scope.$root.$digest();
            expect(mockStrataService.entitlements.get).toHaveBeenCalledWith(false, 'testUser');
            expect(caseService.entitlements).toBeUndefined();
        });
        it('should have a method for validating New Case Page', function () {
            expect(caseService.validateNewCase).toBeDefined();
            expect(caseService.newCaseIncomplete).toBe(true);
            caseService.kase.product = '';
            caseService.kase.version = '';
            caseService.kase.summary = '';
            caseService.kase.description = '';
            caseService.validateNewCase();
            expect(caseService.newCaseIncomplete).toBe(true);
            caseService.kase.product = 'Red Hat Enterprise Linux';
            caseService.kase.version = '6.0';
            caseService.kase.summary = 'Test Summary';
            caseService.kase.description = 'Test Description';
            caseService.validateNewCase();
            expect(caseService.newCaseIncomplete).toBe(false);
        });
        it('should have a method to Show/Hide the FTS flag', function () {
            expect(caseService.showFts).toBeDefined();
            var fts = false;
            caseService.severities = [
                { 'name': '1 (Urgent)' },
                { 'name': '2 (High)' },
                { 'name': '3 (Normal)' },
                { 'name': '4 (Low)' }
            ];
            // Show the FTS flag for sev 1 premium case
            caseService.kase.severity = { 'name': '1 (Urgent)' };
            caseService.kase.entitlement = {};
            caseService.kase.entitlement.sla = 'PREMIUM';
            fts = caseService.showFts();
            expect(fts).toBe(true);
            // Hide the FTS flag for non premium case
            caseService.kase.entitlement.sla = 'STANDARD';
            fts = caseService.showFts();
            expect(fts).toBe(false);
        });
        it('should have a method for defining Notified Users for a case', function () {
            expect(caseService.defineNotifiedUsers).toBeDefined();
            caseService.kase.contact_sso_username = 'testUser';
            caseService.kase.notified_users = {
                'link': [
                    {
                        'title': 'Denises Hughes',
                        'type': 'application/vnd.redhat.user',
                        'sso_username': 'dhughesgit'
                    },
                    {
                        'title': 'Customer Portal-Qa',
                        'type': 'application/vnd.redhat.user',
                        'sso_username': 'customerportalQA'
                    }
                ]
            };
            caseService.defineNotifiedUsers();
            expect(caseService.updatedNotifiedUsers).toContain('testUser', 'dhughesgit', 'customerportalQA');
        });

        it('should have a method for clear case', function () {
            expect(caseService.clearCase).toBeDefined();
            caseService.clearCase();
            expect(caseService.caseDataReady).toBeFalsy();
            expect(caseService.isCommentPublic).toBeFalsy();
            expect(caseService.updatingCase).toBeFalsy();
            expect(caseService.updatingNewCaseSummary).toBeFalsy();
            expect(caseService.updatingNewCaseDescription).toBeFalsy();
            expect(caseService.draftComment).toBeUndefined();
            expect(caseService.draftCommentLocalStorage).toBeUndefined();
        });

        it('should have a method for checkForCaseStatusToggleOnAttachOrComment', function () {
            expect(caseService.checkForCaseStatusToggleOnAttachOrComment).toBeDefined();
            securityService.loginStatus.authedUser.is_internal=true;
            //cannot use mockStrataCase as it has a different status field.
            caseService.kase={};
            caseService.kase.status={};
            caseService.kase.status.name = 'Waiting on Red Hat' ;
            caseService.checkForCaseStatusToggleOnAttachOrComment();
            var status=   { name: 'Waiting on Customer' };
            expect(caseService.kase.status).toEqual(status);
        });

        it('should have a method for create case', function () {
            expect(caseService.createCase).toBeDefined();
            caseService.kase=mockStrataDataService.mockCases[0];
            caseService.kase.severity={name:"Low"};
            securityService.loginStatus.authedUser.sso_username="test";
            caseService.createCase();
            spyOn(mockStrataService.cases, 'post').andCallThrough();
            scope.$root.$digest();
            expect(caseService.localStorageCache.get(securityService.loginStatus.authedUser.sso_username)).toBeUndefined();
        });

        it('should have a method for update case', function () {
            expect(caseService.updateCase).toBeDefined();
           // caseService.kase=mockStrataDataService.mockCases[0];
           caseService.kase=
            {
                "created_by": "Sunil Keshari",
                "created_date": 1405416971000,
                "last_modified_by": "Sunil Keshari",
                "last_modified_date": 1405416972000,
                "id": "500K0000006FeAaIAK",
                "uri": "https://api.access.devgssci.devlab.phx1.redhat.com/rs/cases/01364190",
                "summary": "test case notified users",
                "description": "test",
                "status": "Waiting on Red Hat",
                "product": {
                    "name": "Red Hat Enterprise Linux",
                    "value": "RHEL"
                },
                "version": "7.0",
                "account_number": "940527",
                "escalated": false,
                "contact_name": "Sunil Keshari",
                "contact_sso_username": "skesharigit",
                "origin": "Web",
                "owner": "New Case Queue",
                "severity": "4 (Low)",
                "comments": {},
                "notified_users": {},
                "entitlement": {
                    "sla": "UNKNOWN"
                },
                "fts": false,
                "bugzillas": {},
                "sbr_groups": {},
                "case_number": "01364190",
                "closed": false
            };
            securityService.loginStatus.authedUser.sso_username="test";
            caseService.updateCase();
            spyOn(mockStrataService.cases, 'put').andCallThrough();
            scope.$root.$digest();
            expect(caseService.updatingCase).toBeFalsy();
            expect(caseService.prestineKase, caseService.kase);

        });

        it('should have a method for update local storage for new case', function () {
            expect(caseService.updateLocalStorageForNewCase).toBeDefined();
            caseService.kase=mockStrataDataService.mockCases[0];
            securityService.loginStatus.authedUser.sso_username="test";
            caseService.updateLocalStorageForNewCase();
            scope.$root.$digest();
            expect(caseService.localStorageCache).toBeDefined();

        });


    });
    //Suite for SearchCaseService
    describe('searchCaseService', function () {
        it('should have a method for Search cases resolved for loggedin user', function () {
            expect(searchCaseService.doFilter).toBeDefined();
            searchCaseService.oldParams = {};
            securityService.loginStatus.login = 'testUser';
            securityService.loginStatus.isLoggedIn = true;
            searchBoxService.searchTerm = 'test';
            caseService.status = 'closed';
            caseService.product = 'Red Hat Enterprise Linux';
            caseService.owner = 'testUser';
            caseService.type = 'bug';
            caseService.severity = '1';
            searchCaseService.doFilter();
            spyOn(mockStrataService.cases, 'search').andCallThrough();
            scope.$root.$digest();
            expect(searchCaseService.searching).toBe(false);
            expect(searchCaseService.cases).toEqual(mockStrataDataService.mockFilterCaseResult);
        });

        it('should have a method for Filter cases resolved for loggedin user', function () {
            expect(searchCaseService.doFilter).toBeDefined();
            searchCaseService.oldParams = {};
            securityService.loginStatus.login = 'testUser';
            securityService.loginStatus.isLoggedIn = true;
            searchBoxService.searchTerm = '';
            caseService.status = 'open';
            caseService.product = 'Red Hat Enterprise Linux';
            caseService.owner = 'testUser';
            caseService.type = 'bug';
            caseService.severity = '1';
            caseService.group='ungrouped';
            searchCaseService.refreshFilterCache=true;
            searchCaseService.doFilter();
            spyOn(mockStrataService.cases, 'filter').andCallThrough();
            scope.$root.$digest();
            spyOn(mockStrataService.cache, 'clr').andCallThrough();
            scope.$root.$digest();
            expect(searchCaseService.searching).toBe(false);
            expect(searchCaseService.cases).toEqual(mockStrataDataService.mockFilterCaseResult);
        });

        it('should have a method to clear the search criteria and result', function () {
            expect(searchCaseService.clear).toBeDefined();
            searchCaseService.oldParams = {};
            searchBoxService.searchTerm = 'test';
            searchCaseService.clear();
            expect(searchBoxService.searchTerm).toEqual('');
            expect(searchCaseService.cases).toEqual([]);
        });
        it('should have a method to clear the pagination of the search result', function () {
            expect(searchCaseService.clearPagination).toBeDefined();
            searchCaseService.cases = mockStrataDataService.mockCases;
            searchCaseService.clearPagination();
            expect(searchCaseService.cases).toEqual([]);
        });
    });

    describe('searchBoxService', function () {
        it('should have a method onChange() to enable search button', function () {
            expect(searchBoxService.onChange).toBeDefined();
            searchBoxService.searchTerm = 'test';
            searchBoxService.onChange();
            expect(searchBoxService.disableSearchButton).toBe(false);
        });
        it('should have a method onChange() to disable search button', function () {
            expect(searchBoxService.onChange).toBeDefined();
            searchBoxService.searchTerm = '';
            searchBoxService.onChange();
            expect(searchBoxService.disableSearchButton).toBe(true);
        });
    });

    //Suite for RecommendationsService
    describe('RecommendationsService', function () {
        it('should have a method to populate pinned recommendations but not linked', function () {
            expect(recommendationsService.populatePinnedRecommendations).toBeDefined();
            caseService.kase.recommendations = {
                'recommendation': [{
                        'linked': false,
                        'pinned_at': true,
                        'last_suggested_date': 1398756627000,
                        'lucene_score': 141,
                        'resource_id': '27450',
                        'resource_type': 'Solution',
                        'resource_uri': 'https://api.access.devgssci.devlab.phx1.redhat.com/rs/solutions/27450',
                        'solution_title': ' test solution title 1 ',
                        'solution_abstract': 'test solution abstract 1',
                        'solution_url': 'https://api.access.devgssci.devlab.phx1.redhat.com/rs/solutions/27450',
                        'title': 'test title 1',
                        'solution_case_count': 3
                    }]
                };
            recommendationsService.populatePinnedRecommendations();
            scope.$root.$digest();
            expect(recommendationsService.pinnedRecommendations).toContain(mockStrataDataService.mockRecommendations[0]);
        });
        it('should have a method to populate non pinned recommendations but linked', function () {
            expect(recommendationsService.populatePinnedRecommendations).toBeDefined();
            caseService.kase.recommendations = {
                'recommendation': [{
                        'linked': true,
                        'pinned_at': false,
                        'last_suggested_date': 1398756612000,
                        'lucene_score': 155,
                        'resource_id': '637583',
                        'resource_type': 'Solution',
                        'resource_uri': 'https://api.access.devgssci.devlab.phx1.redhat.com/rs/solutions/637583',
                        'solution_title': 'test solution title 2',
                        'solution_abstract': 'test solution abstract 2',
                        'solution_url': 'https://api.access.devgssci.devlab.phx1.redhat.com/rs/solutions/637583',
                        'title': 'test title 2',
                        'solution_case_count': 14
                    }]
                };
            recommendationsService.populatePinnedRecommendations();
            scope.$root.$digest();
            expect(recommendationsService.handPickedRecommendations).toContain(mockStrataDataService.mockSolutionLinked);
        });

        it('should have a method to get recommendations', function () {
            expect(recommendationsService.getRecommendations).toBeDefined();
            caseService.kase=mockStrataDataService.mockCases[0];
            recommendationsService.getRecommendations(true,5);
            mockStrataService.recommendationsXmlHack();
            scope.$root.$digest();
            expect(recommendationsService.loadingRecommendations).toBeFalsy();
        });


    });
    //Suite for CaseListService
    describe('CaseListService', function () {
        it('should have a method to define cases for case list', function () {
            expect(caseListService.defineCases).toBeDefined();
            caseListService.defineCases(mockStrataDataService.mockCases);
            expect(caseListService.cases).toEqual(mockStrataDataService.mockCases);
        });
    });
    //Suite for AttachmentsService
    describe('AttachmentsService', function () {
        it('should have a method to delete Attachment resolved', function () {
            expect(attachmentsService.removeOriginalAttachment).toBeDefined();
            attachmentsService.originalAttachments = [
                {
                    'file_name': 'abc.txt',
                    'uuid': '1234'
                },
                {
                    'file_name': 'xyz.txt',
                    'uuid': '4567'
                }
            ];
            expect(attachmentsService.originalAttachments.length).toBe(2);
            caseService.kase.case_number = '12345';
            attachmentsService.removeOriginalAttachment(mockStrataDataService.mockAttachment);
            spyOn(mockStrataService.cases.attachments, 'remove').andCallThrough();
            scope.$root.$digest();
            expect(attachmentsService.originalAttachments.length).toBe(1);
        });
        it('should have a method to delete Attachment rejected', function () {
            expect(attachmentsService.removeOriginalAttachment).toBeDefined();
            attachmentsService.originalAttachments = [
                {
                    'file_name': 'abc.txt',
                    'uuid': '1234'
                },
                {
                    'file_name': 'xyz.txt',
                    'uuid': '4567'
                }
            ];
            expect(attachmentsService.originalAttachments.length).toBe(2);
            caseService.kase.case_number = '12345';
            mockStrataService.rejectCalls();
            spyOn(mockStrataService.cases.attachments, 'remove').andCallThrough();
            attachmentsService.removeOriginalAttachment(mockStrataDataService.mockAttachment);
            scope.$root.$digest();
            expect(attachmentsService.originalAttachments.length).toBe(2);
        });
        it('should have a method to add new Attachment', function () {
            expect(attachmentsService.addNewAttachment).toBeDefined();
            var attachment = {
                    file_name: 'test.txt',
                    uuid: '1234'
                };
            expect(attachmentsService.updatedAttachments.length).toBe(0);
            attachmentsService.addNewAttachment(attachment);
            expect(attachmentsService.updatedAttachments.length).toBe(1);
        });
        it('should have a method to remove Attachment from list', function () {
            expect(attachmentsService.removeUpdatedAttachment).toBeDefined();
            attachmentsService.updatedAttachments = [
                {
                    'file_name': 'abc.txt',
                    'uuid': '1234'
                },
                {
                    'file_name': 'xyz.txt',
                    'uuid': '4567'
                }
            ];
            expect(attachmentsService.updatedAttachments.length).toBe(2);
            attachmentsService.removeUpdatedAttachment(1);
            expect(attachmentsService.updatedAttachments.length).toBe(1);
        });
        it('should have a method to update Attachments resolved', function () {
            expect(attachmentsService.updateAttachments).toBeDefined();
            attachmentsService.originalAttachments = [
                {
                    'file_name': 'abc.txt',
                    'uuid': '1234'
                },
                {
                    'file_name': 'xyz.txt',
                    'uuid': '4567'
                }
            ];
            attachmentsService.updatedAttachments = {
                'attachment': [
                    {
                        'file_name': 'abc.txt',
                        'uuid': '1234'
                    },
                    {
                        'file_name': 'xyz.txt',
                        'uuid': '4567'
                    },
                    {
                        'file_name': 'pqr.txt',
                        'uuid': '5678'
                    }
                ]
            };
            rhaUtils.userTimeZone="Asia/Calcutta";
            attachmentsService.updateAttachments('12345');
            spyOn(mockStrataService.cases.attachments, 'post').andCallThrough();
            scope.$root.$digest();
            expect(attachmentsService.originalAttachments.length).toBe(3);
        });
        it('should have a method to update Attachments rejected', function () {
            expect(attachmentsService.updateAttachments).toBeDefined();
            attachmentsService.updatedAttachments = mockStrataDataService.mockAttachments[0];
            var formdata = new FormData();
                            formdata.append('file', undefined);
                            formdata.append('description', 'sample1 attachment');
            mockStrataService.rejectCalls();
            spyOn(mockStrataService.cases.attachments, 'post').andCallThrough();
            attachmentsService.updateAttachments('12345');
            scope.$root.$digest();
            expect(mockStrataService.cases.attachments.post).toHaveBeenCalledWith(formdata, '12345');
            expect(attachmentsService.originalAttachments.length).toBe(0);
        });
        it('should have a method to define Original Attachments', function () {
            expect(attachmentsService.defineOriginalAttachments).toBeDefined();
            var attachments = [
                    {
                        'file_name': 'abc.txt',
                        'uuid': '1234'
                    },
                    {
                        'file_name': 'xyz.txt',
                        'uuid': '4567'
                    }
                ];
            attachmentsService.defineOriginalAttachments(attachments);
            expect(attachmentsService.originalAttachments).toEqual(attachments);
            attachments = null;
            attachmentsService.defineOriginalAttachments(attachments);
            expect(attachmentsService.originalAttachments).toEqual([]);
        });
        it('should have a method to update BackEnd Attachments', function () {
            expect(attachmentsService.updateBackEndAttachments).toBeDefined();
            attachmentsService.updateBackEndAttachments(mockStrataDataService.mockAttachments);
            expect(attachmentsService.backendAttachments).toEqual(mockStrataDataService.mockAttachments);
        });
        it('should have a method to fetch maximum attachment size', function () {
            expect(attachmentsService.fetchMaxAttachmentSize).toBeDefined();
            attachmentsService.fetchMaxAttachmentSize();
            spyOn(mockStrataService.values.cases.attachment, 'size').andCallThrough();
            scope.$root.$digest();
            expect(attachmentsService.maxAttachmentSize).toEqual(mockStrataDataService.mockFileSize);
        });
        it('should have a method to parse artifact html', function () {
            expect(attachmentsService.parseArtifactHtml).toBeDefined();
            attachmentsService.suggestedArtifact.description="<b>test</b>";
            var parsedHTML=attachmentsService.parseArtifactHtml();
            expect(parsedHTML).toBeDefined();

        });
    });
    //Suite for ProductsService

    describe('ProductsService', function () {
        it('should have a method to get products', function () {
            expect(productsService.getProducts).toBeDefined();
            caseService.kase={};
            caseService.kase.product="Red Hat Enterprise Linux";
            caseService.owner="skesharigit";
            productsService.getProducts(true);
            spyOn(mockStrataService.products, 'list').andCallThrough();
            scope.$root.$digest();
            var mockProducts = [{
                "label": mockStrataDataService.mockProducts[0].name,
                "value": mockStrataDataService.mockProducts[0].code
            }];
            expect(productsService.products).toEqual(mockProducts);
        });
        it('should have a method for version sunset having versions which are sunset', function () {
            expect(productsService.showVersionSunset).toBeDefined();
            caseService.kase={};
            caseService.kase.product="Red Hat Enterprise Linux";
            caseService.kase.version="1.1 - eol";
            var returnValue=productsService.showVersionSunset();
            scope.$root.$digest();
            expect(returnValue).toEqual(true);
        });
        it('should have a method for version sunset having versions which are not sunset', function () {
            expect(productsService.showVersionSunset).toBeDefined();
            caseService.kase={};
            caseService.kase.product="Red Hat Enterprise Linux";
            caseService.kase.version="1.1";
            var returnValue=productsService.showVersionSunset();
            scope.$root.$digest();
            expect(returnValue).toEqual(false);
        });

    });

    describe('DiscussionService', function () {
        it('should have a method to get discussion elements', function () {
            expect(discussionService.getDiscussionElements).toBeDefined();
            discussionService.getDiscussionElements('12345');
            spyOn(mockStrataService.cases.attachments, 'list').andCallThrough();
            scope.$root.$digest();
            expect(attachmentsService.originalAttachments ).toEqual(mockStrataDataService.mockAttachments);
        });
        it('should have a method to update elements', function () {
            caseService.comments=mockStrataDataService.mockComments;
            attachmentsService.originalAttachments=mockStrataDataService.mockAttachments;
            expect(discussionService.updateElements).toBeDefined();
            discussionService.updateElements('12345');
            expect(discussionService.discussionElements).toEqual(caseService.comments.concat(attachmentsService.originalAttachments));
        });
    });

});
