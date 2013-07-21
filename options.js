module.exports = {
	operation: {
		argument: 'string',
		description: 'the operation to perform on the property (get, set, exists, delete, increment, decrement, not, contains, push, pop, shift, unshift)',
		defaultValue: 'set'
	},
	property: {
		argument: 'string',
		description: 'the property (using dot notation for sub properties) to operate on'
	},
	type: {
		argument: 'type',
		description: 'the data type of the value',
		defaultValue: 'string'
	},
	value: {
		argument: 'value',
		description: 'the data to apply with the given operation'
	}
};