'use strict';

export default () => {
    let groups = [];
    return {
        getGroups: function () {
            return groups;
        },
        addGroup: function (group) {
            groups.push(group);
        },
        clearGroups: function () {
            groups = '';
        }
    };
}
