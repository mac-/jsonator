var _ = require('underscore');

module.exports = function parse(propChain) {
	var i, propChainArray = propChain.replace(/\[/g, '.').split('.');

	for (i = 0; i < propChainArray.length; i++) {
		if (propChainArray[i].indexOf(']') > -1) {
			propChainArray[i] = '[' + propChainArray[i];
		}
	}

	propChainArray = _.filter(propChainArray, function(item) { return item.length > 0; });

	return propChainArray;
};