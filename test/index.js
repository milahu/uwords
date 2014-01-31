(function () {
    'use strict';

    /*global require, describe, it, expect */

    var uwords = require('./..');

    describe('library', function () {
        it('gets words from the text', function () {
            var ruHi, enHi, words;

            ruHi = String.fromCharCode(1055, 1088, 1080, 1074, 1077, 1090);
            enHi = 'Hi';

            words = uwords(ruHi + ' - ' + enHi);

            expect(words[0]).toBe(ruHi);
            expect(words[1]).toBe(enHi);
        });
    });
}());
