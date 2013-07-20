var _ = require('underscore'),
	propChainParser = require('./propertyChainParser.js'),
	arrayNotationRegExp = /\[.+\]/,
	defaultOperation = 'set',
	getNormalizedProp = function(prop) {
		if (prop.match(arrayNotationRegExp)) {
			prop = parseInt(prop.split('[')[1].split(']')[0], 10);
		}
		return prop;
	},
	traverseObjectToProperty = function(obj, propChainArray) {
		var prop, tmpObj = obj;
		for (var i = 0; i < propChainArray.length; i++) {
			prop = getNormalizedProp(propChainArray[i]);
			if (_.isObject(tmpObj) && !_.isArray(tmpObj) && !tmpObj.hasOwnProperty(propChainArray[i])) {
				throw new Error('Object does not contain property');
			}
			else if (_.isArray(tmpObj) && prop >= tmpObj.length) {
				throw new Error('Array does not contain element');
			}
			tmpObj = tmpObj[prop];
			if (tmpObj === undefined) {
				throw new Error('Invalid property chain');
			}
		}

		return tmpObj;
	},
	// strategies should take the full object, the property chain string, and the value to operate with
	// and return the entire modified object or, if no modification is intended, the result of the operation
	strategies = {
		
		get: function(obj, propChain, value) {
			var propChainArray = propChainParser(propChain),
				lastProp = getNormalizedProp(propChainArray.pop());

			return traverseObjectToProperty(obj, propChainArray)[lastProp];
		},
		exists: function(obj, propChain, value) {
			var propChainArray = propChainParser(propChain),
				lastProp = getNormalizedProp(propChainArray.pop());

			return traverseObjectToProperty(obj, propChainArray).hasOwnProperty(lastProp);
		},
		set: function(obj, propChain, value) {
			var propChainArray = propChainParser(propChain),
				lastProp = getNormalizedProp(propChainArray.pop()),
				subObj = traverseObjectToProperty(obj, propChainArray);

			subObj[lastProp] = value;
			return obj;
		},
		delete: function(obj, propChain, value) {
			var propChainArray = propChainParser(propChain),
				lastProp = getNormalizedProp(propChainArray.pop()),
				subObj = traverseObjectToProperty(obj, propChainArray);

			delete subObj[lastProp];
			return obj;
		},
		increment: function(obj, propChain, value) {
			var propChainArray = propChainParser(propChain),
				lastProp = getNormalizedProp(propChainArray.pop()),
				subObj = traverseObjectToProperty(obj, propChainArray);

			subObj[lastProp]++;
			return obj;
		},
		decrement: function(obj, propChain, value) {
			var propChainArray = propChainParser(propChain),
				lastProp = getNormalizedProp(propChainArray.pop()),
				subObj = traverseObjectToProperty(obj, propChainArray);

			subObj[lastProp]--;
			return obj;
		},
		not: function(obj, propChain, value) {
			var propChainArray = propChainParser(propChain),
				lastProp = getNormalizedProp(propChainArray.pop()),
				subObj = traverseObjectToProperty(obj, propChainArray);

			subObj[lastProp] = !subObj[lastProp];
			return obj;
		},
		contains: function(obj, propChain, value) {
			var propChainArray = propChainParser(propChain),
				lastProp = getNormalizedProp(propChainArray.pop()),
				subObj = traverseObjectToProperty(obj, propChainArray);

			return !!(_.find(subObj[lastProp], function(item){ return _.isEqual(item, value); }));
		},
		push: function(obj, propChain, value) {
			var propChainArray = propChainParser(propChain),
				lastProp = getNormalizedProp(propChainArray.pop()),
				subObj = traverseObjectToProperty(obj, propChainArray);

			subObj[lastProp].push(value);
			return obj;
		},
		pop: function(obj, propChain, value) {
			var propChainArray = propChainParser(propChain),
				lastProp = getNormalizedProp(propChainArray.pop()),
				subObj = traverseObjectToProperty(obj, propChainArray);

			subObj[lastProp].pop();
			return obj;
		},
		shift: function(obj, propChain, value) {
			var propChainArray = propChainParser(propChain),
				lastProp = getNormalizedProp(propChainArray.pop()),
				subObj = traverseObjectToProperty(obj, propChainArray);

			subObj[lastProp].shift();
			return obj;
		},
		unshift: function(obj, propChain, value) {
			var propChainArray = propChainParser(propChain),
				lastProp = getNormalizedProp(propChainArray.pop()),
				subObj = traverseObjectToProperty(obj, propChainArray);

			subObj[lastProp].unshift(value);
			return obj;
		}
	};

// factory returns an object that has a getStrategy method
module.exports = {
	getStrategy: function(operation) {
		// returns an object that contains an execute function which executes the matching strategy
		var strategy = {
			execute: (strategies.hasOwnProperty(operation)) ? strategies[operation] : strategies[defaultOperation]
		};
		return strategy;
	}
};