/* eslint @typescript-eslint/no-extraneous-class: "off" */
import Version from './version.js';

export default class Plugin {
	// Get config value
	static getConfig(key) {
		const value = figma.currentPage.getSharedPluginData(this.namespace, key);
		return Plugin.unpackValue(value);
	}

	// Set config value
	static setConfig(key, value) {
		figma.currentPage.setSharedPluginData(this.namespace, key, Plugin.packValue(value));
	}

	// Get node value
	static getNode(node, key) {
		const value = node.getSharedPluginData(this.namespace, key);
		return Plugin.unpackValue(value);
	}

	// Set node value
	static setNode(node, key, value) {
		node.setSharedPluginData(this.namespace, key, Plugin.packValue(value));
	}

	// Get Version
	static getVersion(node) {
		const versionString = Plugin.getNode(node, 'version');
		return versionString ? new Version(versionString) : undefined;
	}

	// Set Version
	static setVersion(node, version) {
		const newVersion = version instanceof Version ? (new Version(version)).toString() : version;
		Plugin.setNode(node, 'version', newVersion);
	}

	// Get History
	static getHistory(node) {
		const history = Plugin.getNode(node, 'history');
		if (history) {
			return history
				.map(h => ({
					version: h.version ? new Version(h.version) : undefined,
					commitMessage: h.commitMessage ? h.commitMessage : undefined,
				}));
		}

		return undefined;
	}

	// Set History
	static setHistory(node, history) {
		if (history) {
			history = history.slice(0, 5);
		}

		const stringifiedHistory = history.map(h => {
			let _a;
			return ({
				version: (_a = h === null || h === void 0 ? void 0 : h.version) === null || _a === void 0 ? void 0 : _a.toString(),
				commitMessage: h === null || h === void 0 ? void 0 : h.commitMessage,
			});
		});
		console.log(stringifiedHistory, history);
		Plugin.setNode(node, 'history', stringifiedHistory);
	}

	static packValue(value) {
		switch (typeof value) {
			case 'string':
				return value;
			case 'undefined':
				return '';
			default:
				return JSON.stringify(value);
		}
	}

	static unpackValue(value) {
		try {
			return JSON.parse(value);
		} catch {
			return value === '' ? undefined : value;
		}
	}
}
Plugin.namespace = 'com.github.florianb.figma_semantic_versioning';
