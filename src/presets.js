// @ts-check

import { combineRgb } from '@companion-module/base'

export function initPresets(self) {
	/** @type {import('@companion-module/base').CompanionPresetDefinitions} */
	let presets = {}

	const foregroundColor = combineRgb(255, 255, 255) // White
	const backgroundColorRed = combineRgb(255, 0, 0) // Red

	// ########################
	// #### Power Presets ####
	// ########################

	presets['power-on'] = {
		category: 'Power',
		type: 'button',
		name: 'Power On',
		style: {
			text: 'Power\\nON',
			size: '14',
			color: 16777215,
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [
			{
				down: [
					{
						actionId: 'on',
						options: {},
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
	}

	presets['power-off'] = {
		category: 'Power',
		type: 'button',
		name: 'Power Off',
		style: {
			text: 'Power\\nOFF',
			size: '14',
			color: 16777215,
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [
			{
				down: [
					{
						actionId: 'off',
						options: {},
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
	}

	self.setPresetDefinitions(presets)
}
