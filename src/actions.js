module.exports = {
	// ##########################
	// #### Instance Actions ####
	// ##########################
	setActions: function () {
		let self = this;
		let actions = {};

		// ########################
		// #### Power Actions ####
		// ########################

		actions.on = {
			label: 'Power On',
			callback: function (action, bank) {
				self.power(1);
			}
		}

		actions.off = {
			label: 'Power Off',
			callback: function (action, bank) {
				self.power(0);
			}
		}

		return actions
	}
}