var instance_skel = require('../../../instance_skel')
var actions = require('./actions.js')
var presets = require('./presets.js')
var feedbacks = require('./feedbacks.js')
var variables = require('./variables.js')

var debug;

const tapoapi = require('tp-link-tapo-connect');

instance.prototype.PLUGINFO = {
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

	try {
		if (self.DEVICE) {
			self.DEVICE.closeConnection();
		}
	}
	catch(error) {
		self.DEVICE = null;
	}

	debug('destroy', self.id)
};

// Initalize module
instance.prototype.init = function () {
	let self = this;

	debug = self.debug;
	log = self.log;

	self.status(self.STATUS_WARNING, 'connecting');

	self.getInformation();

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

	self.init_actions();
	self.init_feedbacks();
	self.init_variables();
	self.init_presets();

	self.checkVariables();	
	self.checkFeedbacks();
};

instance.prototype.handleError = function(err) {
	let self = this;

	let error = err.toString();

	Object.keys(err).forEach(function(key) {
		if (key === 'code') {
			if (err[key] === 'ECONNREFUSED') {
				error = 'Unable to communicate with Device. Connection refused. Is this the right IP address? Is it still online?';
				self.log('error', error);
				self.status(self.STATUS_ERROR);
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
			
			const getDeviceInfoResponse = await tapoapi.getDeviceInfo(self.DEVICE_TOKEN);
			console.log(getDeviceInfoResponse);
			//update data based on response
		}
		catch(error) {
			self.handleError(error);
		}
	}
};


instance.prototype.updateData = function () {
	let self = this;
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