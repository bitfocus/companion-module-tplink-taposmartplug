
// TP-Link Tapo Smart Plug

const { InstanceBase, InstanceStatus, runEntrypoint } = require('@companion-module/base');
const UpgradeScripts = require('./src/upgrades');

const config = require('./src/config');
const actions = require('./src/actions');
const feedbacks = require('./src/feedbacks');
const variables = require('./src/variables');
const presets = require('./src/presets');

const utils = require('./src/utils');

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

		this.INTERVAL = null; //used for polling device

		this.PLUGINFO = {
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

		this.DEVICE = null;
	}

	async destroy() {
		this.stopInterval();
	}

	async init(config) {
		this.configUpdated(config);
	}

	async configUpdated(config) {
		this.config = config;

		this.updateStatus(InstanceStatus.Connecting, 'Connecting to device...');

		this.initLogin();
		
		this.initActions();
		this.initFeedbacks();
		this.initVariables();
		this.initPresets();

		this.checkVariables();
		this.checkFeedbacks();
	}
}

runEntrypoint(tapoInstance, UpgradeScripts);