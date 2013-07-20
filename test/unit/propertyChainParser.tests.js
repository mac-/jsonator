var assert = require('assert'),
	_ = require('underscore'),
	propertyChainParser = require('../../lib/propertyChainParser.js');

describe('propertyChainParser()', function() {

	it('should convert a string to an array of properties', function(done) {
		var result = propertyChainParser('test.id[0].type[1][5].fnord');

		assert(_.isArray(result), 'result should be an array');
		assert(result.length === 7, 'result length should be 6');
		assert(result[0] === 'test', 'first element in result should equal "test"');
		assert(result[1] === 'id', 'second element in result should equal "id"');
		assert(result[2] === '[0]', 'third element in result should equal "[0]"');
		assert(result[3] === 'type', 'fourth element in result should equal "type"');
		assert(result[4] === '[1]', 'fifth element in result should equal "[1]"');
		assert(result[5] === '[5]', 'sixth element in result should equal "[5]"');
		assert(result[6] === 'fnord', 'seventh element in result should equal "fnord"');
		done();
	});

	it('should convert a string that starts with an array accessor to an array of properties', function(done) {
		var result = propertyChainParser('[0]');

		assert(_.isArray(result), 'result should be an array');
		assert(result.length === 1, 'result length should be 1');
		assert(result[0] === '[0]', 'first element in result should equal "[0]"');
		done();
	});

	it('should convert a string that has many dots in a row to an array of properties', function(done) {
		var result = propertyChainParser('a...b');
		
		assert(_.isArray(result), 'result should be an array');
		assert(result.length === 2, 'result length should be 2');
		assert(result[0] === 'a', 'first element in result should equal "a"');
		assert(result[1] === 'b', 'second element in result should equal "b"');
		done();
	});

});