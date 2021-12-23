/* eslint @typescript-eslint/no-extraneous-class: "off" */

import Version from './version.js';

export default abstract class Plugin {
	public static namespace = 'solutions.mindkeeper.butterfly';

	// Get or set the config value
	public static config(key: string, value?: any): any | undefined {
		if (value === undefined) {
			const returnValue = figma.currentPage.getSharedPluginData(this.namespace, key);

			if (returnValue.length > 0) {
				return JSON.parse(returnValue);
			}
		} else {
			const newValue = value === undefined ? '' : JSON.stringify(value);
			figma.currentPage.setSharedPluginData(this.namespace, key, newValue);
		}
	}

	// Get or set a node value
	public static node(node: BaseNode, key: string, value?: any): any | undefined {
		if (value === undefined) {
			const returnValue = node.getSharedPluginData(this.namespace, key);

			if (returnValue.length > 0) {
				return JSON.parse(returnValue);
			}
		} else {
			const newValue = value === undefined ? '' : JSON.stringify(value);
			node.setSharedPluginData(this.namespace, key, newValue);
		}
	}

	// Get or set a version
	public static version(node: BaseNode, version?: Version): Version | undefined {
		if (version) {
			Plugin.node(node, 'version', version.toString());
		} else {
			const versionString: string = Plugin.node(node, 'version') as string;

			return versionString ? new Version(versionString) : undefined;
		}
	}
}
