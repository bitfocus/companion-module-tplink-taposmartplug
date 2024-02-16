module.exports = {
	initVariables: function () {
		let self = this;
		let variables = [];

		variables.push({ variableId: 'device_id', name: 'Device ID' });
		variables.push({ variableId: 'fw_ver', name: 'FW Version' });
		variables.push({ variableId: 'hw_ver', name: 'HW Version' });
		variables.push({ variableId: 'model', name: 'Model' });
		variables.push({ variableId: 'mac', name: 'MAC Address' });
		
		variables.push({ variableId: 'hw_id', name: 'HW ID' });
		variables.push({ variableId: 'fw_id', name: 'FW ID' });
		variables.push({ variableId: 'oem_id', name: 'OEM ID' });

		variables.push({ variableId: 'on_time', name: 'On Time' });
		variables.push({ variableId: 'overheated', name: 'Overheated' });
		variables.push({ variableId: 'nickname', name: 'Nickname' });
		variables.push({ variableId: 'location', name: 'Location' });
		
		variables.push({ variableId: 'latitude', name: 'Latitude' });
		variables.push({ variableId: 'longitude', name: 'Longitude' });

		variables.push({ variableId: 'ssid', name: 'SSID' });
		variables.push({ variableId: 'signal_level', name: 'Signal Level' });
		variables.push({ variableId: 'rssi', name: 'RSSI' });

		variables.push({ variableId: 'power_state', name: 'Power State' });

		self.setVariableDefinitions(variables);
	},

	checkVariables: function () {
		let self = this;

		try {
			let variableObj = {};

			variableObj['device_id'] = self.PLUGINFO.device_id;
			variableObj['fw_ver'] = self.PLUGINFO.fw_ver;
			variableObj['hw_ver'] = self.PLUGINFO.hw_ver;
			variableObj['model'] = self.PLUGINFO.model;
			variableObj['mac'] = self.PLUGINFO.mac;

			variableObj['hw_id'] = self.PLUGINFO.hw_id;
			variableObj['fw_id'] = self.PLUGINFO.fw_id;
			variableObj['oem_id'] = self.PLUGINFO.oem_id;

			variableObj['on_time'] = self.PLUGINFO.on_time;
			variableObj['overheated'] = (self.PLUGINFO.overheated == true ? 'Yes' : 'No');
			variableObj['nickname'] = self.PLUGINFO.nickname;
			variableObj['location'] = self.PLUGINFO.location;

			variableObj['latitude'] = self.PLUGINFO.latitude;
			variableObj['longitude'] = self.PLUGINFO.longitude;

			variableObj['ssid'] = self.PLUGINFO.ssid;
			variableObj['signal_level'] = self.PLUGINFO.signal_level;
			variableObj['rssi'] = self.PLUGINFO.rssi;

			variableObj['power_state'] = (self.PLUGINFO.device_on == true ? 'On' : 'Off');

			self.setVariableValues(variableObj);
		}
		catch(error) {
			self.log('error', 'Error Setting Variables: ' + String(error));
		}
	}
}
