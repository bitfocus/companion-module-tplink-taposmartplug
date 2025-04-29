// TP-Link Tapo Smart Plug
// @ts-check

import { InstanceBase, InstanceStatus, runEntrypoint } from '@companion-module/base'
import UpgradeScripts from './upgrades.js'

import config from './config.js'
import actions from './actions.js'
import feedbacks from './feedbacks.js'
import variables from './variables.js'
import presets from './presets.js'

import utils from './utils.js'

class TapoInstance extends InstanceBase {
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

runEntrypoint(TapoInstance, UpgradeScripts)
