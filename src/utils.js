const { InstanceStatus } = require('@companion-module/base');

const TAPO = require('tp-link-tapo-connect');

module.exports = {
	initLogin: async function() {
		let self = this;
	
		if (self.config.host) {
			try {
				const cloudApi = await TAPO.cloudLogin(self.config.email, self.config.password);
				const devices = await cloudApi.listDevices();
				console.log(devices);
				self.DEVICE = await TAPO.loginDeviceByIp(self.config.email, self.config.password, self.config.host);
				if (self.DEVICE) {
					self.updateStatus(InstanceStatus.Ok);
					self.getInformation();
					self.setupInterval();
				}
			}
			catch(error) {
				console.log('initLogin error:');
				console.log(error);
				self.handleError(error);
			}
		}
	},

	getInformation: async function () {
		//Get all information from Device
		let self = this;
	
		if (self.config.host) {
			try {
				if (self.DEVICE) {
					let data = await self.DEVICE.getDeviceInfo();
					self.updateData(data);
				}
			}
			catch(error) {
				self.handleError(error);
			}
		}
	},

	setupInterval: function() {
		let self = this;
	
		if (self.INTERVAL !== null) {
			clearInterval(self.INTERVAL);
			self.INTERVAL = null;
		}
	
		self.config.interval = parseInt(self.config.interval);
	
		if (self.config.enable_polling == true) {
			self.log('info', 'Starting Update Interval.');
			self.INTERVAL = setInterval(self.getInformation.bind(self), self.config.interval);
		}
	},
	
	stopInterval: function () {
		let self = this;
	
		self.log('info', 'Stopping Update Interval.');
	
		if (self.INTERVAL) {
			clearInterval(self.INTERVAL);
			self.INTERVAL = null;
		}
	},
	
	restartInterval: function() {
		let self = this;
	
		self.updateStatus(InstanceStatus.Ok);
		self.setupInterval();
	},
	
	handleError: function(err) {
		let self = this;
	
		self.log('error', 'Stopping Update interval due to error.');
		self.stopInterval();

		console.log(err);
	
		let error = err.toString();

		console.log(error);

		try {	
			Object.keys(err).forEach(function(key) {
				if (key === 'code') {
					switch(err[key]) {
						case 'ECONNREFUSED':
						case 'EHOSTUNREACH':
						case 'ETIMEDOUT':
							error = 'Unable to communicate with Device. Connection refused. Is this the right IP address? Is it still online?';
							self.log('error', error);
							self.updateStatus(InstanceStatus.ConnectionFailure);
							setTimeout(self.restartInterval.bind(self), 30000); //restart interval after 30 seconds
							break;
					}
				}
			});
		}
		catch(error) {
			//error handling the error, just show generic error
			console.log(error);
			self.log('error', error);
		}
	},
	
	updateData: function (data) {
		let self = this;
	
		self.updateStatus(InstanceStatus.Ok);
	
		try {
			self.PLUGINFO.device_id = data.device_id;
			self.PLUGINFO.fw_ver = data.fw_ver;
			self.PLUGINFO.hw_ver = data.hw_ver;
			self.PLUGINFO.model = data.model;
			self.PLUGINFO.mac = data.mac;
	
			self.PLUGINFO.hw_id = data.hw_id;
			self.PLUGINFO.fw_id = data.fw_id;
			self.PLUGINFO.oem_id = data.oem_id;
	
			self.PLUGINFO.on_time = data.on_time;
			self.PLUGINFO.overheated = data.overheated;
			self.PLUGINFO.nickname = data.nickname;
			self.PLUGINFO.location = data.location;
	
			self.PLUGINFO.latitude = data.latitude;
			self.PLUGINFO.longitude = data.longitude;
	
			self.PLUGINFO.ssid = data.ssid;
			self.PLUGINFO.signal_level = data.signal_level;
			self.PLUGINFO.rssi = data.rssi;
	
			self.PLUGINFO.device_on = data.device_on;
	
			self.checkFeedbacks();
			self.checkVariables();
		}
		catch(error) {
			//error setting data
			console.log('error settting data');
			console.log(error);
		}
	},

	power: async function(powerState) {
		let self = this;
	
		if (self.DEVICE) {
			try {
				let plugName = self.PLUGINFO.nickname;
				self.log('info', `Setting ${plugName} Power State to: ${(powerState ? 'On' : 'Off')}`);
	
				if (powerState == 1) {
					await self.DEVICE.turnOn();
				}
				else {
					await self.DEVICE.turnOff();
				}

				if (self.INTERVAL == null) { //if interval is not running, update status
					self.getInformation();
				}
			}
			catch(error) {
				self.handleError(error);
			}
		}
	},

	setBulbBrightness: async function(brightness) {
		let self = this;
	
		if (self.DEVICE) {
			try {
				let plugName = self.PLUGINFO.nickname;
				self.log('info', `Setting ${plugName} Bulb Brightness to: ${brightness}`);
	
				await self.DEVICE.setBrightness(brightness);

				if (self.INTERVAL == null) { //if interval is not running, update status
					self.getInformation();
				}
			}
			catch(error) {
				self.handleError(error);
			}
		}
	},

	setBulbColor: async function(color) {
		let self = this;
	
		if (self.DEVICE) {
			try {
				let plugName = self.PLUGINFO.nickname;
				self.log('info', `Setting ${plugName} Bulb Color to: ${color}`);
	
				await self.DEVICE.setColour(color);

				if (self.INTERVAL == null) { //if interval is not running, update status
					self.getInformation();
				}
			}
			catch(error) {
				self.handleError(error);
			}
		}
	}	
}