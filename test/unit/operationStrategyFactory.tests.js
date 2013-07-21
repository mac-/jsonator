var assert = require('assert'),
	_ = require('underscore'),
	operationStrategyFactory = require('../../lib/operationStrategyFactory.js');

describe('operationStrategyFactory', function() {

	it('should expose a getStrategy method', function(done) {

		assert(_.isFunction(operationStrategyFactory.getStrategy), 'getStrategy should be a function');
		done();
	});

	it('should throw an error if property in property chain does not exists', function(done) {

		var strategy = operationStrategyFactory.getStrategy('get');

		assert.throws(function() {
			strategy.execute({id:1234}, 'fnord.test');
		}, /.*/gi, 'should throw error');
		done();
	});

	it('should throw an error if property in property chain is undefined', function(done) {

		var strategy = operationStrategyFactory.getStrategy('get');

		assert.throws(function() {
			strategy.execute({id:[undefined, 1, 2]}, 'id[0].test');
		}, /.*/gi, 'should throw error');
		done();
	});

	it('should throw an error if array element does not exists', function(done) {

		var strategy = operationStrategyFactory.getStrategy('get');
		
		assert.throws(function() {
			strategy.execute({id:[{a:1},2,3]}, 'id[4].a');
		}, /.*/gi, 'should throw error');
		done();
	});

	describe('get', function() {

		var strategy = operationStrategyFactory.getStrategy('get');

		it('should get the value of a prop on an object', function(done) {
			var result = strategy.execute({id:1234}, 'id');

			assert(result === 1234, 'result should be 1234');
			done();
		});

		it('should get the value of a prop on an object with nested props', function(done) {
			var result = strategy.execute({id:{type:{test:true}}}, 'id.type.test');

			assert(result === true, 'result should be true');
			done();
		});

		it('should get the value of a prop on an object with nested props and nested arrays', function(done) {
			var result = strategy.execute({id:[{test:true}]}, 'id[0].test');

			assert(result === true, 'result shouold be true');
			done();
		});

	});


	describe('exists', function() {

		var strategy = operationStrategyFactory.getStrategy('exists');

		it('should check if a prop on an object exists', function(done) {
			var result = strategy.execute({id:1234}, 'id');

			assert(result === true, 'should return true');
			done();
		});

		it('should check if a prop on an object with nested props exists', function(done) {
			var result = strategy.execute({id:{type:{test:123}}}, 'id.type.test');

			assert(result === true, 'should return true');
			done();
		});

		it('should check if a prop on an object with nested props and nested arrays exists', function(done) {
			var result = strategy.execute({id:[{test:123}]}, 'id[0].test');
			assert(result === true, 'should return true');

			result = strategy.execute({id:[{test:123}]}, 'id[1]');
			assert(result === false, 'should return false');

			result = strategy.execute({id:[{test:123}]}, 'id.test');
			assert(result === false, 'should return false');

			done();
		});

	});



	describe('set', function() {

		var strategy = operationStrategyFactory.getStrategy('set');

		it('should set a prop on an object', function(done) {
			var result = strategy.execute({id:1234}, 'id', 'fnord');

			assert(_.isEqual(result, {id:'fnord'}), 'should set id to "fnord"');
			done();
		});

		it('should set a prop on a nested object', function(done) {
			var result = strategy.execute({id:{type:1234}}, 'id.type', 'fnord');

			assert(_.isEqual(result, {id:{type:'fnord'}}), 'should set id.type to "fnord"');
			done();
		});

		it('should set a prop in a nested array', function(done) {
			var result = strategy.execute({id:{type:[1,2,3]}}, 'id.type[0]', 'fnord');

			assert(_.isEqual(result, {id:{type:['fnord',2,3]}}), 'should set id.type[0] to "fnord"');
			done();
		});

	});



	describe('delete', function() {

		var strategy = operationStrategyFactory.getStrategy('delete');

		it('should delete a prop on an object', function(done) {
			var result = strategy.execute({id:1234}, 'id');

			assert(_.isEqual(result, {}), 'should delete id');
			done();
		});

		it('should delete a prop on a nested object', function(done) {
			var result = strategy.execute({id:{type:1234}}, 'id.type');

			assert(_.isEqual(result, {id:{}}), 'should delete id.type');
			done();
		});

		it('should delete a prop in a nested array', function(done) {
			var result = strategy.execute({id:{type:[{a:1},2,3]}}, 'id.type[0].a');

			assert(_.isEqual(result, {id:{type:[{},2,3]}}), 'should delete id.type[0].a');
			done();
		});

	});



	describe('increment', function() {

		var strategy = operationStrategyFactory.getStrategy('increment');

		it('should increment a prop on an object', function(done) {
			var result = strategy.execute({id:1234}, 'id');

			assert(_.isEqual(result, {id:1235}), 'should increment id');
			done();
		});

		it('should delete a prop on a nested object', function(done) {
			var result = strategy.execute({id:{type:1234}}, 'id.type');

			assert(_.isEqual(result, {id:{type:1235}}), 'should increment id.type');
			done();
		});

		it('should delete a prop in a nested array', function(done) {
			var result = strategy.execute({id:{type:[1,2,3]}}, 'id.type[0]');

			assert(_.isEqual(result, {id:{type:[2,2,3]}}), 'should increment id.type[0]');
			done();
		});

	});



	describe('deccrement', function() {

		var strategy = operationStrategyFactory.getStrategy('decrement');

		it('should deccrement a prop on an object', function(done) {
			var result = strategy.execute({id:1234}, 'id');

			assert(_.isEqual(result, {id:1233}), 'should deccrement id');
			done();
		});

		it('should delete a prop on a nested object', function(done) {
			var result = strategy.execute({id:{type:1234}}, 'id.type');

			assert(_.isEqual(result, {id:{type:1233}}), 'should deccrement id.type');
			done();
		});

		it('should delete a prop in a nested array', function(done) {
			var result = strategy.execute({id:{type:[1,2,3]}}, 'id.type[0]');

			assert(_.isEqual(result, {id:{type:[0,2,3]}}), 'should deccrement id.type[0]');
			done();
		});

	});




	describe('not', function() {

		var strategy = operationStrategyFactory.getStrategy('not');

		it('should not a prop on an object', function(done) {
			var result = strategy.execute({id:false}, 'id');
			
			assert(_.isEqual(result, {id:true}), 'should not id');
			done();
		});

		it('should not a prop on a nested object', function(done) {
			var result = strategy.execute({id:{type:true}}, 'id.type');

			assert(_.isEqual(result, {id:{type:false}}), 'should not id.type');
			done();
		});

		it('should not a prop in a nested array', function(done) {
			var result = strategy.execute({id:{type:[true,2,3]}}, 'id.type[0]');

			assert(_.isEqual(result, {id:{type:[false,2,3]}}), 'should not id.type[0]');
			done();
		});

	});


	describe('contains', function() {

		var strategy = operationStrategyFactory.getStrategy('contains');

		it('should check to see if an array contains an element', function(done) {
			var result = strategy.execute([1,2,3], '', 1);

			assert(result === true, 'result should be true');
			done();
		});

		it('should check to see if a nested array contains an element', function(done) {
			var result = strategy.execute({id:{type:[1,2,3]}}, 'id.type', 1);
			assert(result === true, 'result should be true');

			result = strategy.execute({id:{type:[1,2,3]}}, 'id.type', 4);
			assert(result === false, 'result should be false');
			done();
		});

		it('should check to see if a nested array contains an object', function(done) {
			var result = strategy.execute({id:{type:[{a:1},2,3]}}, 'id.type', {a:1});
			assert(result === true, 'result should be true');

			result = strategy.execute({id:{type:[{a:1},2,3]}}, 'id.type', {a:2});
			assert(result === false, 'result should be false');
			done();
		});

	});



	describe('push', function() {

		var strategy = operationStrategyFactory.getStrategy('push');

		it('should push an element into an array', function(done) {
			var result = strategy.execute([1,2,3], '', 1);

			assert(_.isEqual(result, [1,2,3,1]), 'should push 1 onto array');
			done();
		});

		it('should push an element into a nested array', function(done) {
			var result = strategy.execute({id:{type:[1,2,3]}}, 'id.type', 1);

			assert(_.isEqual(result, {id:{type:[1,2,3,1]}}), 'should push 1 onto array');
			done();
		});

	});



	describe('pop', function() {

		var strategy = operationStrategyFactory.getStrategy('pop');

		it('should pop an element from an array', function(done) {
			var result = strategy.execute([1,2,3], '');

			assert(_.isEqual(result, [1,2]), 'should pop last element from array');
			done();
		});

		it('should pop an element from a nested array', function(done) {
			var result = strategy.execute({id:{type:[1,2,3]}}, 'id.type', 1);

			assert(_.isEqual(result, {id:{type:[1,2]}}), 'should pop last element from array');
			done();
		});

	});


	describe('shift', function() {

		var strategy = operationStrategyFactory.getStrategy('shift');

		it('should shift an element from an array', function(done) {
			var result = strategy.execute([1,2,3], '');

			assert(_.isEqual(result, [2,3]), 'should shift first element from array');
			done();
		});

		it('should shift an element from a nested array', function(done) {
			var result = strategy.execute({id:{type:[1,2,3]}}, 'id.type', 1);

			assert(_.isEqual(result, {id:{type:[2,3]}}), 'should shift first element from array');
			done();
		});

	});


	describe('unshift', function() {

		var strategy = operationStrategyFactory.getStrategy('unshift');

		it('should unshift an element into an array', function(done) {
			var result = strategy.execute([1,2,3], '', 1);

			assert(_.isEqual(result, [1,1,2,3]), 'should unshift 1 onto array');
			done();
		});

		it('should unshift an element into a nested array', function(done) {
			var result = strategy.execute({id:{type:[1,2,3]}}, 'id.type', 1);

			assert(_.isEqual(result, {id:{type:[1,1,2,3]}}), 'should unshift 1 onto array');
			done();
		});

	});




});