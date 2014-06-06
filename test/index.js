'use strict';

/*global describe, it, expect */

var uwords = require('./..');

function mix() {
    var args, list, base;

    args = Array.prototype.slice.call(arguments);
    list = [ ];

    if (Array.isArray(args[0])) {
        if (1 === args.length) {
            list.push.apply(list, args[0]);
        } else {
            args[0].forEach(function (item) {
                args[0] = item;
                Array.prototype.push.apply(list, mix.apply(null, args));
            });
        }
    } else if ('string' === typeof args[0]) {
        if (1 === args.length) {
            list.push(args[0]);
        } else {
            base = args.shift();
            if (Array.isArray(args[0])) {
                args[0] = args[0].map(function (item) {
                    return base + item;
                });
                Array.prototype.push.apply(list, mix.apply(null, args));
            } else {
                args[0] = base + args[0];
                Array.prototype.push.apply(list, mix.apply(null, args));
            }
        }
    }

    return list;
}

describe('mix', function () {
    it('mixes empty args', function () {
        var list = mix();
        expect(list.length).toBe(0);
    });

    it('mixes one string', function () {
        var list = mix('ok');
        expect(list.length).toBe(1);
        expect(list[0]).toBe('ok');
    });

    it('mixes two strings', function () {
        var list = mix('ok1', 'ok2');
        expect(list.length).toBe(1);
        expect(list[0]).toBe('ok1ok2');
    });

    it('mixes array', function () {
        var list = mix([ 'ok1', 'ok2' ]);
        expect(list.length).toBe(2);
        expect(list[0]).toBe('ok1');
        expect(list[1]).toBe('ok2');
    });

    it('mixes string and array', function () {
        var list = mix('ok', [ '1', '2' ]);
        expect(list.length).toBe(2);
        expect(list[0]).toBe('ok1');
        expect(list[1]).toBe('ok2');
    });
});

describe('library', function () {
    var ruHi, enHi, ws, ews;

    ruHi = String.fromCharCode(1055, 1088, 1080, 1074, 1077, 1090);
    enHi = 'Hi';
    ws = [ ' ', '  ', '\n' ];
    ews = [ '' ].concat(ws);

    it('gets english hi', function () {
        mix(ews, enHi, ews).forEach(function (text) {
            var words = uwords(text);
            expect(words.length).toBe(1);
            expect(words[0]).toBe(enHi);
        });
    });

    it('gets russian hi', function () {
        mix(ews, ruHi, ews).forEach(function (text) {
            var words = uwords(text);
            expect(words.length).toBe(1);
            expect(words[0]).toBe(ruHi);
        });
    });

    it('gets words from the text #1', function () {
        var words = uwords(ruHi + ' - ' + enHi);
        expect(words.length).toBe(2);
        expect(words[0]).toBe(ruHi);
        expect(words[1]).toBe(enHi);
    });
});
