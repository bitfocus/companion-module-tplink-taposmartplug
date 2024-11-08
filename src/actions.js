module.exports = {
	initActions: function () {
		let self = this;
		let actions = {};

		actions.on = {
			name: 'Power On',
			callback: function (action, bank) {
				self.power(1);
			}
		}

		actions.off = {
			name: 'Power Off',
			callback: function (action, bank) {
				self.power(0);
			}
		}

		actions.toggle = {
			name: 'Toggle Power',
			callback: function (action, bank) {
				if (self.PLUGINFO.device_on == 1) {
					self.power(0);
				}
				else {
					self.power(1);
				}
			}
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
					range: true
				}
			],
			callback: function (action, bank) {
				self.setBulbBrightness(action.options.brightness);
			}
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
					]
				}
			],
			callback: function (action, bank) {
				self.setBulbColor(action.options.color);
			}
		}

		self.setActionDefinitions(actions);
	}
}