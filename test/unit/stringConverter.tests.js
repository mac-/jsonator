var assert = require('assert'),
	_ = require('underscore'),
	stringConverter = require('../../lib/stringConverter.js');

describe('stringConverter()', function() {

	it('should not convert a string', function(done) {
		var result = stringConverter('string', '1');

		assert(_.isString(result), 'result should be a string');
		assert(result === '1', 'result should equal "1"');
		done();
	});

	it('should convert a string to a number', function(done) {
		var result = stringConverter('number', '1');

		assert(_.isNumber(result), 'result should be a number');
		assert(result === 1, 'result should equal 1');
		done();
	});

	it('should convert a string to a boolean', function(done) {
		var result = stringConverter('boolean', 'true');
		
		assert(_.isBoolean(result), 'result should be a boolean');
		assert(result === true, 'result should equal true');
		done();
	});

	it('should convert a string to an object', function(done) {
		var result = stringConverter('object', '{"test": "test"}');
		
		assert(_.isObject(result), 'result should be an object');
		assert(result.test === 'test', 'property on result should equal "test"');
		done();
	});

	it('should convert a string to an array', function(done) {
		var result = stringConverter('array', '[{"test": "test"}]');
		
		assert(_.isArray(result), 'result should be an array');
		assert(result[0].test === 'test', 'property on result should equal "test"');
		done();
	});

	it('should not convert a string to an object when it is invalid JSON', function(done) {
		var result = stringConverter('object', '{"test": test}');
		
		assert(_.isUndefined(result), 'result should be undefined');
		done();
	});

	it('should convert a string to null', function(done) {
		var result = stringConverter('null', 'test_string');
		
		assert(_.isNull(result), 'result should be null');
		done();
	});

});