'use strict';

import clone from 'lodash/clone'
import map from 'lodash/map'

export default class AdvancedSearchCaseList {
    constructor(ConstantsService, $uibModal, AdvancedCaseSearchService, SearchBookmarkService) {
        this.$uibModal = $uibModal;
        this.AdvancedCaseSearchService = AdvancedCaseSearchService;
        this.SearchBookmarkService = SearchBookmarkService;
        this.allColumns = ConstantsService.advancedCaseListColumns;
    }

    selectColumns() {
        this.$uibModal.open({
            template: require('../views/columnSelectModal.jade'),
            controller: 'ColumnSelectModal',
            controllerAs: '$ctrl',
            keyboard: false,
            backdrop: 'static',
            resolve: {
                allColumns: () => clone(this.allColumns),
                selectedColumns: () => clone(this.AdvancedCaseSearchService.getColumns())
            }
        }).result.then((columns) => {
            this.AdvancedCaseSearchService.columns = columns;
            const bookmark = this.SearchBookmarkService.getCurrentBookmark();
            if(bookmark != null) {
                bookmark.columns = map(columns, 'id');
                this.SearchBookmarkService.saveBookmark(bookmark);
            }
        });
    }

    getColumns() {
        return this.AdvancedCaseSearchService.getColumns();
    }

}
