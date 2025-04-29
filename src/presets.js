import { combineRgb } from '@companion-module/base'

export default {
	initPresets: function () {
		let self = this
		let presets = []

		const foregroundColor = combineRgb(255, 255, 255) // White
		const backgroundColorRed = combineRgb(255, 0, 0) // Red

		// ########################
		// #### Power Presets ####
		// ########################

		presets.push({
			category: 'Power',
			type: 'button',
			name: 'Power On',
			style: {
				text: 'Power\\nON',
				size: '14',
				color: '16777215',
				bgcolor: combineRgb(0, 0, 0),
			},
			steps: [
				{
					down: [
						{
							actionId: 'on',
						},
					],
					up: [],
				},
			],
			feedbacks: [
				{
					feedbackId: 'powerState',
					options: {
						option: 1,
					},
					style: {
						color: foregroundColor,
						bgcolor: backgroundColorRed,
					},
				},
			],
		})

		presets.push({
			category: 'Power',
			type: 'button',
			name: 'Power Off',
			style: {
				text: 'Power\\nOFF',
				size: '14',
				color: '16777215',
				bgcolor: combineRgb(0, 0, 0),
			},
			steps: [
				{
					down: [
						{
							actionId: 'off',
						},
					],
					up: [],
				},
			],
			feedbacks: [
				{
					feedbackId: 'powerState',
					options: {
						option: 0,
					},
					style: {
						color: foregroundColor,
						bgcolor: backgroundColorRed,
					},
				},
			],
		})

		self.setPresetDefinitions(presets)
	},
}
