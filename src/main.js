// TP-Link Tapo Smart Plug
// @ts-check

import { InstanceBase, InstanceStatus, runEntrypoint } from '@companion-module/base'
import { UpgradeScripts } from './upgrades.js'
import { getConfigFields } from './config.js'
import { initActions } from './actions.js'
import { initFeedbacks } from './feedbacks.js'
import { initVariables, checkVariables } from './variables.js'
import { initPresets } from './presets.js'

import { TapiApi } from './api.js'

export class TapoInstance extends InstanceBase {
	/** @type {NodeJS.Timeout | null} */
	INTERVAL = null

	API = new TapiApi()

	constructor(internal) {
		super(internal)

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

		this.API.initLogin(this.config)

		this.setActionDefinitions(initActions(this.API))
		this.setFeedbackDefinitions(initFeedbacks(this.API))
		this.setVariableDefinitions(initVariables())
		this.setPresetDefinitions(initPresets())

		this.checkVariables()
		this.checkFeedbacks()
	}

	getConfigFields() {
		return getConfigFields()
	}

	checkVariables() {
		this.setVariableValues(checkVariables(this.API, this))
	}

	setupInterval() {
		if (this.INTERVAL !== null) {
			clearInterval(this.INTERVAL)
			this.INTERVAL = null
		}

		this.config.interval = parseInt(this.config.interval) || 500

		if (this.config.enable_polling) {
			this.log('info', 'Starting Update Interval.')
			this.INTERVAL = setInterval(() => this.API.getInformation(), this.config.interval)
		}
	}

	stopInterval() {
		this.log('info', 'Stopping Update Interval.')

		if (this.INTERVAL) {
			clearInterval(this.INTERVAL)
			this.INTERVAL = null
		}
	}

	restartInterval() {
		this.updateStatus(InstanceStatus.Ok)
		this.setupInterval()
	}
}

runEntrypoint(TapoInstance, UpgradeScripts)
