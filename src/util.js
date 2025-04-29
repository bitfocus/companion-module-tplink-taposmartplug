/**
 * @param {import('./api.js').TapiApi} api
 * @returns {import('@companion-module/base').CompanionInputFieldDropdown[]}
 */
export function getChildOptionFields(api) {
	if (api.CHILDPLUGS.length === 0) return []
	return [
		{
			type: 'dropdown',
			label: 'Child device',
			id: 'child',
			default: 'parent',
			choices: [
				{ id: 'parent', label: 'Parent' },
				...api.CHILDPLUGS.map((child, index) => ({
					label: `${child.nickname} (${index + 1})`,
					id: index,
				})),
			],
		},
	]
}

/**
 *
 * @param {import('./api.js').TapiApi} api
 * @param {import('@companion-module/base').InputValue | undefined} deviceId
 * @returns {import('tp-link-tapo-connect').TapoDeviceInfo | null}
 */
export function getPlugInfoForDeviceId(api, deviceId) {
	if (deviceId === undefined || deviceId === 'parent') {
		// Root device
		return api.PLUGINFO
	} else {
		return api.CHILDPLUGS[deviceId]
	}
}
