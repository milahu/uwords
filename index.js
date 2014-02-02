(function () {
    'use strict';

    /*global require, module */

    var _ = require('lodash'),
        letters = require('./letters.js');

    module.exports = function (text) {
        var words, position, flag, index, limit;

        words = [ ];
        position = 0;
        flag = false;

        for (index = 0, limit = text.length; index < limit; index += 1) {
            if (-1 === _.indexOf(letters, text.charCodeAt(index), true)) {
                if (flag) {
                    words.push(text.substring(position, index));
                    flag = false;
                }
            } else if (!flag) {
                position = index;
                flag = true;
            }
        }

        if (flag) {
            words.push(text.substring(position));
        }

        return words;
    };
}());
