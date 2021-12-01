/* eslint import/no-anonymous-default-export: [2, {"allowObject": true}] */
export default {
	namespace: 'solutions.mindkeeper.butterfly',

	// Get or set the config value
	config(key: string, value?: any): any | undefined {
		if (value === undefined) {
			const returnValue = figma.currentPage.getSharedPluginData(this.namespace, key);

			if (returnValue.length > 0) {
				return JSON.parse(returnValue);
			}
		} else {
			const newValue = value === undefined ? '' : JSON.stringify(value);
			figma.currentPage.setSharedPluginData(this.namespace, key, newValue);
		}
	},

	// Get or set a node value
	node(node: BaseNode, key: string, value?: any): any | undefined {
		if (value === undefined) {
			const returnValue = node.getSharedPluginData(this.namespace, key);

			if (returnValue.length > 0) {
				return JSON.parse(returnValue);
			}
		} else {
			const newValue = value === undefined ? '' : JSON.stringify(value);
			node.setSharedPluginData(this.namespace, key, newValue);
		}
	},
};
