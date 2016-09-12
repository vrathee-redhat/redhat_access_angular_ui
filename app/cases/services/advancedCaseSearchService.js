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
                    console.debug(`performSearch found: ${response['case']} cases`);
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
