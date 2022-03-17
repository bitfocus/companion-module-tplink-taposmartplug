module.exports = {
	// ##########################
	// #### Define Variables ####
	// ##########################
	setVariables: function () {
		let self = this;
		let variables = [];

		variables.push({ name: 'device_id', label: 'Device ID' });
		variables.push({ name: 'fw_ver', label: 'FW Version' });
		variables.push({ name: 'hw_ver', label: 'HW Version' });
		variables.push({ name: 'model', label: 'Model' });
		variables.push({ name: 'mac', label: 'MAC Address' });
		
		variables.push({ name: 'hw_id', label: 'HW ID' });
		variables.push({ name: 'fw_id', label: 'FW ID' });
		variables.push({ name: 'oem_id', label: 'OEM ID' });

		variables.push({ name: 'on_time', label: 'On Time' });
		variables.push({ name: 'overheated', label: 'Overheated' });
		variables.push({ name: 'nickname', label: 'Nickname' });
		variables.push({ name: 'location', label: 'Location' });
		
		variables.push({ name: 'latitude', label: 'Latitude' });
		variables.push({ name: 'longitude', label: 'Longitude' });

		variables.push({ name: 'ssid', label: 'SSID' });
		variables.push({ name: 'signal_level', label: 'Signal Level' });
		variables.push({ name: 'rssi', label: 'RSSI' });

		variables.push({ name: 'power_state', label: 'Power State' });

		return variables
	},

	// #########################
	// #### Check Variables ####
	// #########################
	checkVariables: function () {
		let self = this;

		try {
			self.setVariable('device_id', self.PLUGINFO.device_id);
			self.setVariable('fw_ver', self.PLUGINFO.fw_ver);
			self.setVariable('hw_ver', self.PLUGINFO.hw_ver);
			self.setVariable('model', self.PLUGINFO.model);
			self.setVariable('mac', self.PLUGINFO.mac);

			self.setVariable('hw_id', self.PLUGINFO.hw_id);
			self.setVariable('fw_id', self.PLUGINFO.fw_id);
			self.setVariable('oem_id', self.PLUGINFO.oem_id);

			self.setVariable('on_time', self.PLUGINFO.on_time);
			self.setVariable('overheated', (self.PLUGINFO.overheated == true ? 'On' : 'Off'));
			self.setVariable('nickname', self.PLUGINFO.nickname);
			self.setVariable('location', self.PLUGINFO.location);

			self.setVariable('latitude', self.PLUGINFO.latitude);
			self.setVariable('longitude', self.PLUGINFO.longitude);

			self.setVariable('ssid', self.PLUGINFO.ssid);
			self.setVariable('signal_level', self.PLUGINFO.signal_level);
			self.setVariable('rssi', self.PLUGINFO.rssi);

			self.setVariable('power_state', (self.PLUGINFO.device_on == true ? 'On' : 'Off'));
		}
		catch(error) {
			self.log('error', 'Error from Plug: ' + String(error));
		}
	}
}
