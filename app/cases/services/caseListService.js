'use strict';

export default class CaseListService {
    constructor() {
        this.cases = [];
        this.defineCases = function (cases) {
            this.cases = cases;
        }
    }
}
