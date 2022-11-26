/* eslint @typescript-eslint/no-extraneous-class: "off" */

import Version from './version.js';

type HistoryObject = {
	version?: Version;
	commitMessage?: string;
};

export default abstract class Plugin {
	public static namespace = 'com.github.florianb.figma_semantic_versioning';

	// Get config value
	public static getConfig(key: string): any {
		const value = figma.currentPage.getSharedPluginData(this.namespace, key);

		return Plugin.unpackValue(value);
	}

	// Set config value
	public static setConfig(key: string, value?: any): void {
		figma.currentPage.setSharedPluginData(this.namespace, key, Plugin.packValue(value));
	}

	// Get node value
	public static getNode(node: BaseNode, key: string): any {
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

	// Get History
	public static getHistory(node: BaseNode): HistoryObject[] | undefined {
		const history = Plugin.getNode(node, 'history') as any[];

		if (history) {
			return history
				.map(h => ({
					version: h.version ? new Version(h.version) : undefined,
					commitMessage: h.commitMessage ? h.commitMessage as string : undefined,
				}));
		}

		return undefined;
	}

	// Set History
	public static setHistory(node: BaseNode, history?: HistoryObject[]) {
		if (history) {
			history = history.slice(0, 5);
		}

		const stringifiedHistory = history.map(h => ({
			version: h?.version?.toString(),
			commitMessage: h?.commitMessage,
		}));

		Plugin.setNode(node, 'history', stringifiedHistory);
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
