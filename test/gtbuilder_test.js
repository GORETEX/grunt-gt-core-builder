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

exports.gore_core_builder = {
    setUp: function(done) {
        // setup here if necessary
        done();
    },
    default_options: function(test) {
        var actual,
            expected;

        test.expect(2);

        actual = grunt.file.read('.gtbuilder_cache/uglify-files.json');
        expected = grunt.file.read('test/expected/uglify-files.json');
        test.equal(actual, expected, 'should create a JSON file for uglify.');

        actual = grunt.file.read('.gtbuilder_cache/moduleflags.scss');
        expected = grunt.file.read('test/expected/moduleflags.scss');
        test.equal(actual, expected, 'should create a module flags file.');

        test.done();
    },
};
