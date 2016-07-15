'use strict';

export default class AccordionDemoCtrl {
    constructor($scope, accordian) {
        'ngInject';

        $scope.oneAtATime = true;
        $scope.groups = accordian.getGroups();
    }
}
