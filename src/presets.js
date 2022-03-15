module.exports = {
	setPresets: function () {
		let self = this;
		let presets = [];

		const foregroundColor = self.rgb(255, 255, 255) // White
		const backgroundColorRed = self.rgb(255, 0, 0) // Red

		// ########################
		// #### Power Presets ####
		// ########################

		presets.push({
			category: 'Power',
			label: 'Power On',
			bank: {
				style: 'text',
				text: 'Power\\nON',
				size: '14',
				color: '16777215',
				bgcolor: self.rgb(0, 0, 0),
			},
			actions: [
				{
					action: 'on'
				}
			],
			feedbacks: [
				{
					type: 'powerState',
					options: {
						option: 1
					},
					style: {
						color: foregroundColor,
						bgcolor: backgroundColorRed
					}
				}
			]
		})

		presets.push({
			category: 'Power',
			label: 'Power Off',
			bank: {
				style: 'text',
				text: 'Power\\nOFF',
				size: '14',
				color: '16777215',
				bgcolor: self.rgb(0, 0, 0),
			},
			actions: [
				{
					action: 'off'
				}
			],
			feedbacks: [
				{
					type: 'powerState',
					options: {
						option: 0
					},
					style: {
						color: foregroundColor,
						bgcolor: backgroundColorRed
					}
				}
			]
		})
	
		return presets;
	}
}
