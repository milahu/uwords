(function () {
    'use strict';

    /*global require, module, __dirname */

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

        grunt.registerTask('default', [ 'jshint', 'test' ]);
    };
}());
