// TP-Link Tapo Smart Plug
// @ts-check

import { InstanceBase, InstanceStatus, runEntrypoint } from '@companion-module/base'
import { UpgradeScripts } from './upgrades.js'
import { getConfigFields } from './config.js'
import { initActions } from './actions.js'
import { initFeedbacks } from './feedbacks.js'
import { initVariables, checkVariables } from './variables.js'
import { initPresets } from './presets.js'

import utils from './utils.js'

class TapoInstance extends InstanceBase {
	constructor(internal) {
		super(internal)

		// Assign the methods from the listed files to this class
		Object.assign(this, {
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

		this.updateStatus(InstanceStatus.Connecting)

		this.initLogin()

		initActions(this)
		initFeedbacks(this)
		initVariables(this)
		initPresets(this)

		this.checkVariables()
		this.checkFeedbacks()
	}

	getConfigFields() {
		return getConfigFields()
	}

	checkVariables() {
		checkVariables(this)
	}
}

runEntrypoint(TapoInstance, UpgradeScripts)
