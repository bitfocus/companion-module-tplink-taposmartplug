// @ts-check

export function initVariables() {
	/** @type {import('@companion-module/base').CompanionVariableDefinition[]} */
	let variables = []

	variables.push({ variableId: 'device_id', name: 'Device ID' })
	variables.push({ variableId: 'fw_ver', name: 'FW Version' })
	variables.push({ variableId: 'hw_ver', name: 'HW Version' })
	variables.push({ variableId: 'model', name: 'Model' })
	variables.push({ variableId: 'mac', name: 'MAC Address' })

	variables.push({ variableId: 'hw_id', name: 'HW ID' })
	variables.push({ variableId: 'fw_id', name: 'FW ID' })
	variables.push({ variableId: 'oem_id', name: 'OEM ID' })

	variables.push({ variableId: 'on_time', name: 'On Time' })
	variables.push({ variableId: 'overheated', name: 'Overheated' })
	variables.push({ variableId: 'nickname', name: 'Nickname' })
	variables.push({ variableId: 'location', name: 'Location' })

	variables.push({ variableId: 'latitude', name: 'Latitude' })
	variables.push({ variableId: 'longitude', name: 'Longitude' })

	variables.push({ variableId: 'ssid', name: 'SSID' })
	variables.push({ variableId: 'signal_level', name: 'Signal Level' })
	variables.push({ variableId: 'rssi', name: 'RSSI' })

	variables.push({ variableId: 'power_state', name: 'Power State' })

	return variables
}

/**
 * @param {import('./api.js').TapiApi} api
 */
export function checkVariables(api, instance) {
	try {
		/** @type {import('@companion-module/base').CompanionVariableValues} */
		let variableObj = {}

		variableObj['device_id'] = api.PLUGINFO.device_id
		variableObj['fw_ver'] = api.PLUGINFO.fw_ver
		variableObj['hw_ver'] = api.PLUGINFO.hw_ver
		variableObj['model'] = api.PLUGINFO.model
		variableObj['mac'] = api.PLUGINFO.mac

		variableObj['hw_id'] = api.PLUGINFO.hw_id
		variableObj['fw_id'] = api.PLUGINFO.fw_id
		variableObj['oem_id'] = api.PLUGINFO.oem_id

		variableObj['on_time'] = api.PLUGINFO.on_time
		variableObj['overheated'] = api.PLUGINFO.overheated == true ? 'Yes' : 'No'
		variableObj['nickname'] = api.PLUGINFO.nickname
		variableObj['location'] = api.PLUGINFO.location

		variableObj['latitude'] = api.PLUGINFO.latitude
		variableObj['longitude'] = api.PLUGINFO.longitude

		variableObj['ssid'] = api.PLUGINFO.ssid
		variableObj['signal_level'] = api.PLUGINFO.signal_level
		variableObj['rssi'] = api.PLUGINFO.rssi

		variableObj['power_state'] = api.PLUGINFO.device_on == true ? 'On' : 'Off'

		return variableObj
	} catch (error) {
		instance.log('error', 'Error Setting Variables: ' + String(error))
		return {}
	}
}
