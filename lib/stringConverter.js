module.exports = function(type, value) {
	var newVal;
	switch(type.toLowerCase()) {
		case 'number':
			newVal = parseInt(value, 10);
			break;

		case 'boolean':
			newVal = (value === 'true');
			break;

		case 'object':
		case 'array':
			try {
				newVal = JSON.parse(value);
			}
			catch(ex) {
				newVal = undefined;
			}
			break;

		case 'null':
			newVal = null;
			break

		default:
			newVal = value;

	}
	return newVal;
};