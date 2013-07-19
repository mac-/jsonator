module.exports = {
	operation: {
		argument: 'string',
		description: 'the operation to perform on the property (set, delete, increment, decrement, not, push, pop, shift, unshift)',
		defaultValue: 'set'
	},
	property: {
		argument: 'string',
		description: 'the property (using dot notation for sub properties) to operate on',
		required: true
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