const { combineRgb } = require('@companion-module/base');

module.exports = {
	initFeedbacks: function () {
		let self = this;
		let feedbacks = {};

		const foregroundColor = combineRgb(255, 255, 255) // White
		const backgroundColorRed = combineRgb(255, 0, 0) // Red

		feedbacks.powerState = {
			type: 'boolean',
			name: 'Power State',
			description: 'Indicate if Plug is On or Off',
			style: {
				color: foregroundColor,
				bgcolor: backgroundColorRed,
			},
			options: [
				{
					type: 'dropdown',
					label: 'Indicate in X State',
					id: 'option',
					default: 1,
					choices: [
						{ id: 0, label: 'Off' },
						{ id: 1, label: 'On' }
					]
				}
			],
			callback: function (feedback, bank) {
				let opt = feedback.options;

				if (self.PLUGINFO) {
					let plug_state = self.PLUGINFO.device_on;
				
					if (plug_state == opt.option) {
						return true;
					}
				}

				return false
			}
		}

		self.setFeedbackDefinitions(feedbacks);
	}
}
