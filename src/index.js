var instance_skel = require('../../../instance_skel')
var actions = require('./actions.js')
var feedbacks = require('./feedbacks.js')
var variables = require('./variables.js')
var presets = require('./presets.js')

var debug;

const tapoapi = require('tp-link-tapo-connect');

instance.prototype.INTERVAL = null; //used for polling device
instance.prototype.PLUGINFO = {
	device_id: '',
	fw_ver: '',
	hw_ver: '',
	model: '',
	mac: '',

	hw_id: '',
	fw_id: '',
	oem_id: '',

	on_time:  '',
	overheated: false,
	nickname: '',
	location: '',

	latitude: '',
	longitude: '',

	ssid: '',
	signal_level: '',
	rssi: '',

	device_on: false
};

instance.prototype.DEVICE_TOKEN = null;

// ########################
// #### Instance setup ####
// ########################
function instance(system, id, config) {
	let self = this

	// super-constructor
	instance_skel.apply(this, arguments)

	return self
};

instance.GetUpgradeScripts = function () {
	
};

// When module gets deleted
instance.prototype.destroy = function () {
	let self = this;

	self.stopInterval();

	debug('destroy', self.id)
};

// Initalize module
instance.prototype.init = function () {
	let self = this;

	debug = self.debug;
	log = self.log;

	self.status(self.STATUS_WARNING, 'connecting');

	self.getInformation();
	self.setupInterval();

	self.init_actions();
	self.init_feedbacks();
	self.init_variables();
	self.init_presets();

	self.checkVariables();	
	self.checkFeedbacks();
};

// Update module after a config change
instance.prototype.updateConfig = function (config) {
	let self = this;
	self.config = config;

	self.status(self.STATUS_WARNING, 'connecting');
	
	self.getInformation();
	self.setupInterval();

	self.init_actions();
	self.init_feedbacks();
	self.init_variables();
	self.init_presets();

	self.checkVariables();	
	self.checkFeedbacks();
};

instance.prototype.setupInterval = function() {
	let self = this;

	if (self.INTERVAL !== null) {
		clearInterval(self.INTERVAL);
		self.INTERVAL = null;
	}

	self.config.interval = parseInt(self.config.interval);

	if (self.config.interval > 0) {
		self.log('info', 'Starting Update Interval.');
		self.INTERVAL = setInterval(self.getInformation.bind(self), self.config.interval);
	}
};

instance.prototype.stopInterval = function () {
	let self = this;

	self.log('info', 'Stopping Update Interval.');

	if (self.INTERVAL) {
		clearInterval(self.INTERVAL);
		self.INTERVAL = null;
	}
};

instance.prototype.restartInterval = function() {
	let self = this;

	self.status(self.STATUS_OK);
	self.setupInterval();
};

instance.prototype.handleError = function(err) {
	let self = this;

	self.log('error', 'Stopping Update interval due to error.');
	self.stopInterval();

	let error = err.toString();

	Object.keys(err).forEach(function(key) {
		if (key === 'code') {
			switch(err[key]) {
				case 'ECONNREFUSED':
				case 'EHOSTUNREACH':
				case 'ETIMEDOUT':
					error = 'Unable to communicate with Device. Connection refused. Is this the right IP address? Is it still online?';
					self.log('error', error);
					self.status(self.STATUS_ERROR);
					setTimeout(self.restartInterval.bind(self), 30000); //restart interval after 30 seconds
					break;
			}
		}
	});
};

instance.prototype.getInformation = async function () {
	//Get all information from Device
	let self = this;

	if (self.config.host) {
		try {
			if (!self.DEVICE_TOKEN) {
				self.DEVICE_TOKEN = await tapoapi.loginDeviceByIp(self.config.email, self.config.password, self.config.host);
			}

			if (self.DEVICE_TOKEN) {
				let data = await tapoapi.getDeviceInfo(self.DEVICE_TOKEN);
				self.updateData(data);
			}
		}
		catch(error) {
			self.handleError(error);
		}
	}
};


instance.prototype.updateData = function (data) {
	let self = this;

	self.status(self.STATUS_OK);

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
	}
};

// Return config fields for web config
instance.prototype.config_fields = function () {
	let self = this

	return [
		{
			type: 'text',
			id: 'info',
			width: 12,
			label: 'Information',
			value: 'This module controls TP-Link Tapo Smart Plugs.',
		},
		{
			type: 'textinput',
			id: 'host',
			label: 'Plug IP',
			width: 4,
			regex: self.REGEX_IP
		},
		{
			type: 'text',
			id: 'dummy1',
			width: 12,
			label: ' ',
			value: ' ',
		},
		{
			type: 'textinput',
			id: 'email',
			label: 'Email Address',
			width: 3,
			default: 'email@example.com'
		},
		{
			type: 'textinput',
			id: 'password',
			label: 'Password',
			width: 3,
			default: '1234567'
		},
		{
			type: 'text',
			id: 'dummy2',
			width: 12,
			label: ' ',
			value: ' ',
		},
		{
			type: 'text',
			id: 'intervalInfo',
			width: 12,
			label: 'Update Interval',
			value: 'Please enter the amount of time in milliseconds to request new information from the plug. Set to 0 to disable.',
		},
		{
			type: 'textinput',
			id: 'interval',
			label: 'Update Interval',
			width: 3,
			default: 0
		}
	]
};

// ##########################
// #### Instance Actions ####
// ##########################
instance.prototype.init_actions = function (system) {
	this.setActions(actions.setActions.bind(this)());
};

// ############################
// #### Instance Feedbacks ####
// ############################
instance.prototype.init_feedbacks = function (system) {
	this.setFeedbackDefinitions(feedbacks.setFeedbacks.bind(this)());
};

// ############################
// #### Instance Variables ####
// ############################
instance.prototype.init_variables = function () {
	this.setVariableDefinitions(variables.setVariables.bind(this)());
};

// Setup Initial Values
instance.prototype.checkVariables = function () {
	variables.checkVariables.bind(this)();
};

// ##########################
// #### Instance Presets ####
// ##########################
instance.prototype.init_presets = function () {
	this.setPresetDefinitions(presets.setPresets.bind(this)());
};


instance.prototype.power = async function(powerState) {
	let self = this;

	if (self.DEVICE_TOKEN) {
		try {
			let plugName = self.PLUGINFO.nickname;
			self.log('info', `Setting ${plugName} Power State to: ${(powerState ? 'On' : 'Off')}`);

			if (powerState == 1) {
				await tapoapi.turnOn(self.DEVICE_TOKEN);
			}
			else {
				await tapoapi.turnOff(self.DEVICE_TOKEN);
			}
		}
		catch(error) {
			self.handleError(error);
		};
	}
};

instance_skel.extendedBy(instance);
exports = module.exports = instance;