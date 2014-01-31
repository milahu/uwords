(function () {
    'use strict';

    /*global require, module */

    var _ = require('lodash'),
        letters = require('./letters.js');

    module.exports = function (text) {
        var words, word, index, limit, code;

        words = [ ];
        word = null;

        for (index = 0, limit = text.length; index < limit; index += 1) {
            code = text.charCodeAt(index);
            if (-1 === _.indexOf(letters, code, true)) {
                if (null !== word) {
                    words.push(word.join(''));
                    word = null;
                }
            } else {
                if (null === word) {
                    word = [ ];
                }
                word.push(String.fromCharCode(code));
            }
        }

        if (null !== word) {
            words.push(word.join(''));
        }

        return words;
    };
}());
