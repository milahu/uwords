(function () {
    'use strict';

    /*global require, module */

    var letters = require('./letters.json');

    module.exports = letters.reduce(function (list, item) {
        var index, limit;

        if ('number' === typeof item) {
            list.push(item);
        } else {
            for (index = item[0], limit = item[1]; index <= limit; index += 1) {
                list.push(index);
            }
        }

        return list;
    }, [ ]);
}());
