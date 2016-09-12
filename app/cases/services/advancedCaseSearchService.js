'use strict';

export default class AdvancedCaseSearchService {
    constructor(strataService) {
        'ngInject';

        this.searching = false;
        this.cases = [];
        this.query = null;
        this.order = null;

        this.pageSize = 20;
        this.currentPage = 0;
        this.totalCases = null;

        // For displaying where we are at in the pagination
        this.getCasesStart = () => {
            return this.currentPage * this.pageSize;
        };

        this.getCasesEnd = () => {
            const end = (this.currentPage * this.pageSize) + this.pageSize;
            if (end > this.totalCases) {
                return this.totalCases;
            }
            return end;
        };

        this.performSearch = (query, order) => {
            var solrOrder = this.resolveOrder(order);
            if (query == null || this.searching) return;
            if (this.query !== query || this.order !== solrOrder) {
                this.cases = [];
                this.totalCases = null;
                this.currentPage = 0;
            }
            if (this.totalCases != null && this.totalCases <= this.cases.length) return;

            this.searching = true;
            this.query = query;
            this.order = solrOrder;
            return strataService.cases.advancedSearch(query, solrOrder, this.currentPage * this.pageSize, this.pageSize).then((response) => {
                if (response['case'] === undefined) {
                    this.searching = false;
                    this.totalCases = 0;
                } else {
                    Array.prototype.push.apply(this.cases, response['case']);
                    this.searching = false;
                    this.totalCases = response.total_count;
                }
            });
        };

        this.resolveOrder = (selectedOrder) => {
            if (selectedOrder == null) return 'case_lastModifiedDate DESC';
            return 'case_' + selectedOrder.sortField + ' ' + selectedOrder.sortOrder;

        }
    }
}
