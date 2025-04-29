// TP-Link Tapo Smart Plug

const { InstanceBase, InstanceStatus, runEntrypoint } = require('@companion-module/base')
const UpgradeScripts = require('./upgrades')

const config = require('./config')
const actions = require('./actions')
const feedbacks = require('./feedbacks')
const variables = require('./variables')
const presets = require('./presets')

const utils = require('./utils')

class tapoInstance extends InstanceBase {
	constructor(internal) {
		super(internal)

		// Assign the methods from the listed files to this class
		Object.assign(this, {
			...config,
			...actions,
			...feedbacks,
			...variables,
			...presets,
			...utils,
		})

		this.INTERVAL = null //used for polling device

		this.PLUGINFO = {
			device_id: '',
			fw_ver: '',
			hw_ver: '',
			model: '',
			mac: '',

			hw_id: '',
			fw_id: '',
			oem_id: '',

			on_time: '',
			overheated: false,
			nickname: '',
			location: '',

			latitude: '',
			longitude: '',

			ssid: '',
			signal_level: '',
			rssi: '',

			device_on: false,
		}

		this.DEVICE = null
	}

	async destroy() {
		this.stopInterval()
	}

	async init(config) {
		this.configUpdated(config)
	}

	async configUpdated(config) {
		this.config = config

		this.updateStatus(InstanceStatus.Connecting, 'Connecting to device...')

		this.initLogin()

		this.initActions()
		this.initFeedbacks()
		this.initVariables()
		this.initPresets()

		this.checkVariables()
		this.checkFeedbacks()
	}
}

runEntrypoint(tapoInstance, UpgradeScripts)
