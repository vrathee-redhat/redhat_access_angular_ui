'use strict';

export default function () {
    return function(input, start) {
        console.debug(`startFrom, start: ${start}, input: ${input}`);
        if (!input || !start) return input;
        start = +start; //parse to int
        console.debug(`startFrom, start: ${start}, input: ${input}`);
        return input.slice(start);
    };
}
