'use strict';

module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.initConfig({
        pkg : grunt.file.readJSON('package.json'),
        jshint : {
            files : [ '*.js', 'test/**/*.js' ],
            options : {
                bitwise : true,
                camelcase : true,
                curly : true,
                eqeqeq : true,
                forin : true,
                freeze : true,
                immed : true,
                indent : 4,
                latedef : true,
                maxcomplexity : 30,
                maxdepth : 5,
                maxlen : 80,
                maxparams : 7,
                maxstatements : 50,
                newcap : true,
                noarg : true,
                node : true,
                noempty : true,
                nonew : true,
                plusplus : true,
                quotmark : 'single',
                strict : true,
                trailing : true,
                undef : true,
                unused : true
            }
        }
    });

    grunt.registerTask('test', 'test', function () {
        var jasmineNode = require('jasmine-node'),
            done = this.async();

        jasmineNode.getEnv().addReporter({
            reportRunnerResults : function () { done(); }
        });

        // jasmineNode.getEnv().specFilter = function (spec) {
        //     var name = spec.suite.description + ' ' +
        //             spec.description;
        //     return -1 !== name.indexOf('add similar links twice');
        // };

        jasmineNode.executeSpecsInFolder({
            specFolders : [ 'test' ],
            showColors : true
        });
    });

    grunt.registerTask('create-letters-json', 'letters.json', function () {
        var letters, compacted;

        letters = [
            require('unicode/category/Lu'),
            require('unicode/category/Ll'),
            require('unicode/category/Lt'),
            require('unicode/category/Lm'),
            require('unicode/category/Lo')
        ].reduce(function (list, item) {
            list.push.apply(list, Object.keys(item).map(function (value) {
                return parseInt(value, 10);
            }));
            return list;
        }, [ ]).sort(function (a, b) { return a - b; });

        compacted = (function (list) {
            var result, item, idx, value;

            result = [ ];

            item = { begin : list[0], end : list[0] };
            result.push(item);

            for (idx = 1; idx < list.length; idx += 1) {
                value = list[idx];
                if (item.end + 1 === value) {
                    item.end = value;
                } else {
                    item = { begin : list[idx], end : list[idx] };
                    result.push(item);
                }
            }

            for (idx = 0; idx < result.length; idx += 1) {
                item = result[idx];
                if (item.begin === item.end) {
                    result[idx] = item.begin;
                } else {
                    result[idx] = [ item.begin, item.end ];
                }
            }

            return result;
        }(letters));

        require('fs').writeFileSync(__dirname + '/letters.json',
            JSON.stringify(compacted, null, 2));
    });

    grunt.registerTask('benchmark', function () {
        var ruHi, enHi, content, uwords, words, start;

        ruHi = String.fromCharCode(1055, 1088, 1080, 1074, 1077, 1090);
        enHi = 'Hi';

        content = '';
        while (content.length < 10000000) {
            content += ruHi + ' ' + enHi + ' ';
        }

        uwords = require('./');

        start = new Date().getTime();
        words = uwords(content);
        console.log('size=' + content.length + ' words=' + words.length +
            ' time=' + (new Date().getTime() - start) + 'ms');
    });

    grunt.registerTask('compare-uwords-xregexp', function () {
        var ruHi, enHi, content, uwords, xRegExp, wordXre, words1, words2, words3, start;

        ruHi = String.fromCharCode(1055, 1088, 1080, 1074, 1077, 1090);
        enHi = 'Hi';

        content = '';
        while (content.length < 100000) {
            content += ruHi + ' ' + enHi + ' ';
        }

        uwords = require('./');
        //xRegExp = require('xregexp').XRegExp;
        xRegExp = require('xregexp');

        start = new Date().getTime();
        words1 = uwords(content);
        console.log('library=uwords size=' + content.length +
            ' words=' + words1.length +
            ' time=' + (new Date().getTime() - start) + 'ms');

        wordXre = xRegExp('\\p{L}+');
        start = new Date().getTime();
        words2 = [ ];
        xRegExp.forEach(content, wordXre, function (match) {
            words2.push(match[0]);
        });
        console.log('library=xregexp(forEach non-global) size=' + content.length +
            ' words=' + words2.length +
            ' time=' + (new Date().getTime() - start) + 'ms');

        var wordXreGlobal = xRegExp('\\p{L}+', 'g');
        start = new Date().getTime();
        words2 = xRegExp.match(content, wordXreGlobal);
        console.log('library=xregexp(match global) size=' + content.length +
            ' words=' + words2.length +
            ' time=' + (new Date().getTime() - start) + 'ms');

        var noWordXre = xRegExp('\\P{L}+');
        start = new Date().getTime();
        words3 = xRegExp.split(content, noWordXre);
        console.log('library=xregexp(split) size=' + content.length +
            ' words=' + words3.length +
            ' time=' + (new Date().getTime() - start) + 'ms');
            
        for (let i = 0; i < words1.length; i++) {
            if (words1[i] != words2[i]) {
                throw `mismatch: w1 ${words1[i]} != w2 ${words2[i]} at index ${i}`;
            }
        }
        for (let i = 0; i < words1.length; i++) {
            if (words1[i] != words3[i]) {
                throw `mismatch: w1 ${words1[i]} != w3 ${words3[i]} at index ${i}`;
            }
        }
        console.log('result is same: words = ' + words1.slice(0, 10).join(', ') + ', ...');
    });

    grunt.registerTask('default', [ 'jshint', 'test' ]);
    grunt.registerTask('all', [ 'jshint', 'create-letters-json', 'test',
        'compare-uwords-xregexp', 'benchmark' ]);
};
