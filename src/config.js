const { Regex } = require('@companion-module/base')

module.exports = {
	getConfigFields() {
		return [
			{
				type: 'static-text',
				id: 'info',
				label: 'Information',
				width: 12,
				value: 'This module controls TP-Link Tapo Smart Plugs and Bulbs.'
			},
			{
				type: 'textinput',
				id: 'host',
				label: 'Plug IP',
				width: 4,
				regex: Regex.IP
			},
			{
				type: 'static-text',
				id: 'dummy1',
				width: 12,
				label: '',
				value: '<hr />',
			},
			{
				type: 'textinput',
				id: 'email',
				label: 'Email Address',
				width: 3,
				default: 'email@example.com',
			},
			{
				type: 'textinput',
				id: 'password',
				label: 'Password',
				width: 3,
				default: '1234567'
			},
			{
				type: 'static-text',
				id: 'dummy2',
				width: 12,
				label: '',
				value: '<hr />',
			},
			{
				type: 'checkbox',
				id: 'enable_polling',
				label: 'Enable Polling',
				width: 12,
				default: false
			},
			{
				type: 'static-text',
				id: 'intervalInfo',
				width: 12,
				label: 'Update Interval',
				value: 'Please enter the amount of time in milliseconds to request new information from the plug.',
				isVisible: (config) => config.enable_polling === true
			},
			{
				type: 'number',
				id: 'interval',
				label: 'Update Interval',
				width: 3,
				default: 1000,
				min: 100,
				max: 60000,
				isVisible: (config) => config.enable_polling == true
			},
			{
				type: 'static-text',
				id: 'info3',
				width: 12,
				label: '',
				value: '<hr />',
			},
			{
				type: 'static-text',
				id: 'info2',
				label: 'Verbose Logging',
				width: 12,
				value: 'Enabling this option will put more detail in the log, which can be useful for troubleshooting purposes.'
			},
			{
				type: 'checkbox',
				id: 'verbose',
				label: 'Enable Verbose Logging',
				default: false
			},
		]
	}
}