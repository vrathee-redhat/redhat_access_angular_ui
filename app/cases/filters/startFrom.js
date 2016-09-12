'use strict';

export default function () {
    return function(input, start) {
        start = +start; //parse to int
        return input.slice(start);
    };
}
