'use strict';

export default class GroupService {
    constructor() {
        'ngInject';

        this.reloadTable = {};
        this.groupsOnScreen = [];
        this.disableDeleteGroup = true;
    }
}
