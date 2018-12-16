'use strict';

import filter from 'lodash/filter';
import Mark from 'mark.js';
import some from 'lodash/some';

function isBlankStr(str) {
    return !str ? true : str.trim().length == 0;
}

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

export default class DiscussionService {
    constructor($sce, $location, $q, AlertService, RHAUtils, AttachmentsService, CaseService, strataService, HeaderService, securityService, COMMON_CONFIG, SearchBoxService, translate) {
        'ngInject';

        this.discussionElements = [];
        this.chatTranscriptList = [];
        this.comments = CaseService.comments;
        this.attachments = AttachmentsService.originalAttachments;
        this.externalUpdates = CaseService.externalUpdates;
        this.loadingComments = false;
        this.commentTextBoxEnlargen = false;

        this.getDiscussionElements = function (caseId) {
            var attachPromise = null;
            var commentsPromise = null;
            var externalUpdatesPromise = null;
            this.discussionElements = [];
            if (!COMMON_CONFIG.isGS4) {
                attachPromise = AttachmentsService.getAttachments(caseId)
                    .then(() => this.updateElements());
            }
            commentsPromise = CaseService.populateComments(caseId).then(function () {
            }, function (error) {
                if (!HeaderService.pageLoadFailure) {
                    AlertService.addStrataErrorMessage(error);
                }
            });
            externalUpdatesPromise = CaseService.populateExternalUpdates(caseId).then(function () {
            }, function (error) {
                if (!HeaderService.pageLoadFailure) {
                    AlertService.addStrataErrorMessage(error);
                }
            });
            //TODO should this be done in case service???
            this.loadingComments = true;
            if (COMMON_CONFIG.isGS4) {
                return $q.all([commentsPromise, externalUpdatesPromise]);
            }
            return $q.all([attachPromise, commentsPromise, externalUpdatesPromise]);

        };

        this.getHeading = (element) => {
            if (!element.file_name && element.comment_type !== 'chat' && !element.originating_system && (element.public === undefined || element.public === true)) return `Message (${element.created_by_type})`;

            if (!element.file_name && element.comment_type !== 'chat' && !element.originating_system && element.public !== undefined && !element.public) return `Private Message (${element.created_by_type})`;


            if (element.file_name && !element.originating_system) return 'Attachment';

            if (element.comment_type === 'chat') return 'Transcript of chat';

            if (element.originating_system) return element.originating_system;
        }

        this.fieldsToSearchWithin = (element) => {
            return [
                'heading',
                'created_by_type',
                'last_modified_by',
                'modifiedBy',
                'published_date',
                'published_time',
                'text',
                'file_name',
                'checksum',
                'description'
            ]
        }

        this.doSearch = function (searchTerm) {
            const allDiscussionElements = this.makeDiscussionElements();
            if (isBlankStr(searchTerm)) {
                this.discussionElements = allDiscussionElements;
                this.highlightSearchResults(searchTerm);
                return;
            }
            const results = filter(allDiscussionElements, ((element) => {
                return some(this.fieldsToSearchWithin(element), (field) => {
                    const text = field === 'heading' ? translate(this.getHeading(element)) : element[field];
                    return text && (text.search(new RegExp(escapeRegExp(searchTerm), 'gi')) > -1);
                });
            }));
            this.discussionElements = results;
            this.highlightSearchResults(searchTerm);
        }

        this.highlightSearchResults = (searchTerm) => {
            if (isBlankStr(searchTerm)) return;
            setTimeout(() => {
                const d = document.querySelectorAll(".discussion-element");
                console.log(d.length);
                const markInstance = new Mark(d);
                markInstance.unmark({
                    done: angular.bind(this, function () {
                        markInstance.mark(searchTerm, { "separateWordSearch": false });
                    })
                });
            }, 1000);
        }

        this.makeDiscussionElements = () => {
            let _discussionElements = CaseService.comments
                .concat(AttachmentsService.originalAttachments)
                .concat(CaseService.externalUpdates);
            if (this.chatTranscriptList !== undefined && this.chatTranscriptList.length > 0) {
                _discussionElements = _discussionElements.concat(this.chatTranscriptList);
            }
            return _discussionElements;
        }

        this.updateElements = function () {
            this.comments = CaseService.comments;
            this.attachments = AttachmentsService.originalAttachments;
            this.externalUpdates = CaseService.externalUpdates;
            this.discussionElements = this.makeDiscussionElements();
        };
    }
}
