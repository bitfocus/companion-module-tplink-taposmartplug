// @ts-check

import { getChildOptionFields } from './util.js'

/**
 * @param {import('./api.js').TapiApi} api
 */
export function initActions(api) {
	const childrenFields = getChildOptionFields(api)

	/** @type {import('@companion-module/base').CompanionActionDefinitions} */
	let actions = {}

	actions.on = {
		name: 'Power On',
		options: [...childrenFields],
		callback: (action) => {
			api.power(1, action.options.child)
		},
	}

	actions.off = {
		name: 'Power Off',
		options: [...childrenFields],
		callback: (action) => {
			api.power(0, action.options.child)
		},
	}

	actions.toggle = {
		name: 'Toggle Power',
		options: [...childrenFields],
		callback: (action) => {
			api.power(null, action.options.child)
		},
	}

	actions.bulbBrightness = {
		name: 'Set Bulb Brightness',
		options: [
			{
				type: 'number',
				label: 'Brightness',
				id: 'brightness',
				default: 100,
				min: 0,
				max: 100,
				required: true,
				range: true,
			},
		],
		callback: (action) => {
			api.setBulbBrightness(action.options.brightness)
		},
	}

	actions.bulbColor = {
		name: 'Set Bulb Color',
		options: [
			{
				type: 'dropdown',
				label: 'Color',
				id: 'color',
				default: 'white',
				choices: [
					{ id: 'white', label: 'White' },
					{ id: 'warmwhite', label: 'Warm White' },
					{ id: 'daylightwhite', label: 'Daylight White' },
					{ id: 'blue', label: 'Blue' },
					{ id: 'red', label: 'Red' },
					{ id: 'green', label: 'Green' },
					{ id: 'yellow', label: 'Yellow' },
				],
			},
		],
		callback: (action) => {
			api.setBulbColor(action.options.color)
		},
	}

	return actions
}
