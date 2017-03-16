
module.exports = {
	allows(queryIndex, organization) {
		if (!queryIndex) {
			return false;
		}
		if (organization === 'admin') {
			return true;
		}
		let indexExp = new RegExp(organization+'-\\d{4}\\.\\d{2}\\.\\d{2}$');
		return indexExp.test(queryIndex);
	},
};

