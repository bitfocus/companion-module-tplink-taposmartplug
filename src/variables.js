module.exports = {
	// ##########################
	// #### Define Variables ####
	// ##########################
	setVariables: function () {
		let self = this;
		let variables = [];

		variables.push({ name: 'power_state', label: 'Power State' });

		return variables
	},

	// #########################
	// #### Check Variables ####
	// #########################
	checkVariables: function () {
		let self = this;

		try {
			self.setVariable('power_state', (self.PLUGINFO.relay_state == 1 ? 'On' : 'Off'));
		}
		catch(error) {
			self.log('error', 'Error from Plug: ' + String(error));
		}
	}
}
