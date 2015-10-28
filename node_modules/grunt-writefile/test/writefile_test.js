'use strict';

var grunt = require('grunt');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports.writefile = {
    value_options: function(test) {
        var actual = grunt.file.read('tmp/value');
        var expected = grunt.file.read('test/expected/value');

        test.expect(1);
        test.equal(actual, expected);
        test.done();
    },
    json_value_options: function(test) {
        var actual = grunt.file.read('tmp/json_value');
        var expected = grunt.file.read('test/expected/json_value');

        test.expect(1);
        test.equal(actual, expected);
        test.done();
    },
    helper_options: function(test) {
        var actual = grunt.file.read('tmp/helper');
        var expected = grunt.file.read('test/expected/helper');

        test.expect(1);
        test.equal(actual, expected);
        test.done();
    },
    paths_options: function(test) {
        var actual = grunt.file.read('tmp/paths');
        var expected = grunt.file.read('test/expected/paths');

        test.expect(1);
        test.equal(actual, expected);
        test.done();
    },
    paths_ext_options: function(test) {
        var actual = grunt.file.read('tmp/paths.hbs');
        var expected = grunt.file.read('test/expected/paths.hbs');

        test.expect(1);
        test.equal(actual, expected);
        test.done();
    }
};
