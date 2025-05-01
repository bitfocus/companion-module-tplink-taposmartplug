// @ts-check

import { InstanceStatus } from '@companion-module/base'

import TAPO from 'tp-link-tapo-connect'

import { getPlugInfoForDeviceId } from './util.js'

export class TapiApi {
	config = {}

	/** @type {Awaited<ReturnType<typeof TAPO.loginDeviceByIp>> | null} */
	DEVICE = null

	/** @type {import('./main.js').TapoInstance} */
	INSTANCE

	/** @type {TAPO.TapoDeviceInfo | null} */
	PLUGINFO = {
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

	/** @type {TAPO.TapoDeviceInfo[]} */
	CHILDPLUGS = []

	constructor(instance) {
		this.INSTANCE = instance
	}

	async initLogin(config) {
		this.config = config

		const hadChildren = this.CHILDPLUGS.length > 0

		// Clear old device
		this.DEVICE = null
		this.PLUGINFO = null
		this.CHILDPLUGS = []

		this.INSTANCE.deviceInfoUpdated(hadChildren)

		if (this.config.host) {
			// try {
			// 	const cloudApi = await TAPO.cloudLogin(this.config.email, this.config.password)
			// 	const devices = await cloudApi.listDevices()
			// 	console.log('all cloud devices', devices)
			// } catch (e) {
			// 	console.log('Failed to list devices from cloud api')
			// }

			try {
				this.DEVICE = await TAPO.loginDeviceByIp(this.config.email, this.config.password, this.config.host)
				if (this.DEVICE) {
					this.INSTANCE.updateStatus(InstanceStatus.Ok)
					this.getInformation()
					this.INSTANCE.setupInterval()
				}
			} catch (error) {
				console.log('initLogin error:')
				console.log(error)
				this.handleError(error)
			}
		}
	}

	async getInformation() {
		//Get all information from Device

		if (!this.DEVICE) {
			if (this.config.host) {
				this.INSTANCE.log('error', 'Device not connected')
			}

			return
		}

		try {
			let data = await this.DEVICE.getDeviceInfo()
			let children = await this.DEVICE.getChildDevicesInfo()
			console.log('Got new device data with %d children', children.length)

			this.INSTANCE.updateStatus(InstanceStatus.Ok)

			const hasChildrenChanged = children.length !== this.CHILDPLUGS.length

			this.PLUGINFO = data
			this.CHILDPLUGS = children

			this.INSTANCE.deviceInfoUpdated(hasChildrenChanged)
		} catch (error) {
			this.handleError(error)
		}
	}

	handleError(err) {
		this.INSTANCE.log('error', 'Stopping Update interval due to error.')
		this.INSTANCE.stopInterval()

		console.log(err)

		let error = err.toString()

		console.log(error)

		try {
			const errCode = 'code' in err && err['code']
			switch (errCode) {
				case 'ECONNREFUSED':
				case 'EHOSTUNREACH':
				case 'ETIMEDOUT':
					error =
						'Unable to communicate with Device. Connection refused. Is this the right IP address? Is it still online?'
					this.INSTANCE.log('error', error)
					this.INSTANCE.updateStatus(InstanceStatus.ConnectionFailure)
					setTimeout(() => this.INSTANCE.restartInterval(), 30000) //restart interval after 30 seconds
					break
			}
		} catch (error) {
			//error handling the error, just show generic error
			console.log(error)
			this.INSTANCE.log('error', error)
		}
	}

	/**
	 *
	 * @param {0 | 1 | null} powerState
	 * @param {import('@companion-module/base').InputValue | undefined} deviceId
	 */
	async power(powerState, deviceId) {
		if (!this.DEVICE) {
			this.INSTANCE.log('error', 'Device not connected')
			return
		}

		const plugInfo = getPlugInfoForDeviceId(this, deviceId)
		if (!plugInfo) {
			this.INSTANCE.log('error', `Child device "${deviceId}" not found`)
			return
		}

		try {
			let plugName = plugInfo?.nickname || ''
			this.INSTANCE.log('info', `Setting ${plugName} Power State to: ${powerState ? 'On' : 'Off'}`)

			if (powerState === null) powerState = plugInfo.device_on ? 0 : 1

			if (powerState == 1) {
				await this.DEVICE.turnOn(plugInfo.device_id)
			} else {
				await this.DEVICE.turnOff(plugInfo.device_id)
			}

			if (this.INSTANCE.INTERVAL == null) {
				//if interval is not running, update status
				this.getInformation()
			}
		} catch (error) {
			this.handleError(error)
		}
	}

	async setBulbBrightness(brightness) {
		if (!this.DEVICE) {
			this.INSTANCE.log('error', 'Device not connected')
			return
		}

		try {
			let plugName = this.PLUGINFO?.nickname || ''
			this.INSTANCE.log('info', `Setting ${plugName} Bulb Brightness to: ${brightness}`)

			await this.DEVICE.setBrightness(brightness)

			if (this.INSTANCE.INTERVAL == null) {
				//if interval is not running, update status
				this.getInformation()
			}
		} catch (error) {
			this.handleError(error)
		}
	}

	async setBulbColor(color) {
		if (!this.DEVICE) {
			this.INSTANCE.log('error', 'Device not connected')
			return
		}

		try {
			let plugName = this.PLUGINFO?.nickname || ''
			this.INSTANCE.log('info', `Setting ${plugName} Bulb Color to: ${color}`)

			await this.DEVICE.setColour(color)

			if (this.INSTANCE.INTERVAL == null) {
				//if interval is not running, update status
				this.getInformation()
			}
		} catch (error) {
			this.handleError(error)
		}
	}
}
