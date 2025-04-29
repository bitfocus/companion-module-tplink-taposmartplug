this // @ts-check

import { InstanceStatus } from '@companion-module/base'

import TAPO from 'tp-link-tapo-connect'

export class TapiApi {
	config = {}

	/** @type {Awaited<ReturnType<typeof TAPO.loginDeviceByIp>> | null} */
	DEVICE = null

	/** @type {import('./main.js').TapoInstance} */
	INSTANCE

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

	constructor(instance) {
		this.INSTANCE = instance
	}

	async initLogin(config) {
		this.config = config

		if (this.config.host) {
			try {
				const cloudApi = await TAPO.cloudLogin(this.config.email, this.config.password)
				const devices = await cloudApi.listDevices()
				console.log(devices)
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
			this.updateData(data)
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
			Object.keys(err).forEach(function (key) {
				if (key === 'code') {
					switch (err[key]) {
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
				}
			})
		} catch (error) {
			//error handling the error, just show generic error
			console.log(error)
			this.INSTANCE.log('error', error)
		}
	}

	updateData(data) {
		this.INSTANCE.updateStatus(InstanceStatus.Ok)

		try {
			this.PLUGINFO.device_id = data.device_id
			this.PLUGINFO.fw_ver = data.fw_ver
			this.PLUGINFO.hw_ver = data.hw_ver
			this.PLUGINFO.model = data.model
			this.PLUGINFO.mac = data.mac

			this.PLUGINFO.hw_id = data.hw_id
			this.PLUGINFO.fw_id = data.fw_id
			this.PLUGINFO.oem_id = data.oem_id

			this.PLUGINFO.on_time = data.on_time
			this.PLUGINFO.overheated = data.overheated
			this.PLUGINFO.nickname = data.nickname
			this.PLUGINFO.location = data.location

			this.PLUGINFO.latitude = data.latitude
			this.PLUGINFO.longitude = data.longitude

			this.PLUGINFO.ssid = data.ssid
			this.PLUGINFO.signal_level = data.signal_level
			this.PLUGINFO.rssi = data.rssi

			this.PLUGINFO.device_on = data.device_on

			this.INSTANCE.checkFeedbacks()
			this.INSTANCE.checkVariables()
		} catch (error) {
			//error setting data
			console.log('error settting data')
			console.log(error)
		}
	}

	/**
	 *
	 * @param {0 | 1} powerState
	 */
	async power(powerState) {
		if (!this.DEVICE) {
			this.INSTANCE.log('error', 'Device not connected')
			return
		}

		try {
			let plugName = this.PLUGINFO.nickname
			this.INSTANCE.log('info', `Setting ${plugName} Power State to: ${powerState ? 'On' : 'Off'}`)

			if (powerState == 1) {
				await this.DEVICE.turnOn()
			} else {
				await this.DEVICE.turnOff()
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
			let plugName = this.PLUGINFO.nickname
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
			let plugName = this.PLUGINFO.nickname
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
