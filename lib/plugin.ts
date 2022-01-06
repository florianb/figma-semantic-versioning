/* eslint @typescript-eslint/no-extraneous-class: "off" */

import Version from './version.js';

export default abstract class Plugin {
	public static namespace = 'com.github.florianb.figma_semantic_versioning';

	// Get config value
	public static getConfig(key: string): any | undefined {
		const value = figma.currentPage.getSharedPluginData(this.namespace, key);

		return Plugin.unpackValue(value);
	}

	// Set config value
	public static setConfig(key: string, value?: any): void {
		figma.currentPage.setSharedPluginData(this.namespace, key, Plugin.packValue(value));
	}

	// Get node value
	public static getNode(node: BaseNode, key: string): any | undefined {
		const value = node.getSharedPluginData(this.namespace, key);

		return Plugin.unpackValue(value);
	}

	// Set node value
	public static setNode(node: BaseNode, key: string, value?: any): void {
		node.setSharedPluginData(this.namespace, key, Plugin.packValue(value));
	}

	// Get Version
	public static getVersion(node: BaseNode): Version | undefined {
		const versionString = Plugin.getNode(node, 'version') as string | undefined;

		return versionString ? new Version(versionString) : undefined;
	}

	// Set Version
	public static setVersion(node: BaseNode, version?: Version | string) {
		const newVersion = version instanceof Version ? (new Version(version)).toString() : version;

		Plugin.setNode(node, 'version', newVersion);
	}

	private static packValue(value: any): string {
		switch (typeof value) {
			case 'string':
				return value;
			case 'undefined':
				return '';
			default:
				return JSON.stringify(value);
		}
	}

	private static unpackValue(value: string): any {
		try {
			return JSON.parse(value);
		} catch {
			return value === '' ? undefined : value;
		}
	}
}
