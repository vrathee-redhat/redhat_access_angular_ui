'use strict';

import {differenceBy, remove, each, clone} from 'lodash';

export default class ColumnSelectModal {
    constructor($uibModalInstance, allColumns, selectedColumns) {
        'ngInject';

        this.$uibModalInstance = $uibModalInstance;
        this.allColumns = allColumns;
        this.available = differenceBy(allColumns, selectedColumns, 'id');
        // make sure we always add required columns
        this.selected = remove(this.available, {required: true}).concat(selectedColumns);
    }

    cancel() {
        this.$uibModalInstance.dismiss();
    }

    submit() {
        this.$uibModalInstance.close(this.selected);
    }

    reset() {
        this.available = clone(this.allColumns);
        this.selected = remove(this.available, c => c.default || c.required);
    }
}
