angular.module("RedhatAccess.cases").service("AdvancedCaseSearchService", [
	"strataService",
	function(strataService) {
		this.searching = false;
		this.cases = [];
		this.query = null;
        this.order = null;

		this.casesOnPage = 20;
		this.currentPage = -1;
		this.allRecordsCount = null;

		this.performSearch = function (query, order) {
            var solrOrder = this.resolveOrder(order);
			if(query == null || this.searching) return;
			if(this.query !== query || this.order !== solrOrder) {
                this.cases = [];
                this.allRecordsCount = null;
                this.currentPage = -1;
            }
            if(this.allRecordsCount!= null && this.allRecordsCount <= this.cases.length) return;

			this.searching = true;
			this.currentPage++;
			this.query = query;
            this.order = solrOrder;
			strataService.cases.advancedSearch(query, solrOrder, this.currentPage*this.casesOnPage, this.casesOnPage)
				.then(angular.bind(this, function (response) {
					if(response['case'] === undefined) {
						this.searching = false;
                        this.allRecordsCount = 0;
					} else {
						this.cases = this.cases.concat(response['case']);
						this.searching = false;
						this.allRecordsCount = response.total_count;
					}
				}));
		};

        this.resolveOrder = function (selectedOrder) {
            if(selectedOrder == null) return 'case_lastModifiedDate DESC';
            return 'case_' + selectedOrder.sortField + ' ' + selectedOrder.sortOrder;

        }
	}
]);
