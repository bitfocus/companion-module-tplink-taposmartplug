// @ts-check

import { combineRgb } from '@companion-module/base'
import { getChildOptionFields, getPlugInfoForDeviceId } from './util.js'

/**
 * @param {import('./api.js').TapiApi} api
 */
export function initFeedbacks(api) {
	const childrenFields = getChildOptionFields(api)

	/** @type {import('@companion-module/base').CompanionFeedbackDefinitions} */
	let feedbacks = {}

	const foregroundColor = combineRgb(255, 255, 255) // White
	const backgroundColorRed = combineRgb(255, 0, 0) // Red

	feedbacks.powerState = {
		type: 'boolean',
		name: 'Power State',
		description: 'Indicate if Plug is On or Off',
		defaultStyle: {
			color: foregroundColor,
			bgcolor: backgroundColorRed,
		},
		options: [
			...childrenFields,
			{
				type: 'dropdown',
				label: 'Indicate in X State',
				id: 'option',
				default: 1,
				choices: [
					{ id: 0, label: 'Off' },
					{ id: 1, label: 'On' },
				],
			},
		],
		callback: (feedback) => {
			let opt = feedback.options

			const plugInfo = getPlugInfoForDeviceId(api, opt.child)
			if (!plugInfo) return false

			return plugInfo.device_on == Number(opt.option) > 0
		},
	}

	return feedbacks
}
