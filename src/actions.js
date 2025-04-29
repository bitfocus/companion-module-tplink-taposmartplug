// @ts-check

export function initActions(self) {
	/** @type {import('@companion-module/base').CompanionActionDefinitions} */
	let actions = {}

	actions.on = {
		name: 'Power On',
		options: [],
		callback: () => {
			self.power(1)
		},
	}

	actions.off = {
		name: 'Power Off',
		options: [],
		callback: () => {
			self.power(0)
		},
	}

	actions.toggle = {
		name: 'Toggle Power',
		options: [],
		callback: () => {
			if (self.PLUGINFO.device_on == 1) {
				self.power(0)
			} else {
				self.power(1)
			}
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
			self.setBulbBrightness(action.options.brightness)
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
			self.setBulbColor(action.options.color)
		},
	}

	self.setActionDefinitions(actions)
}
