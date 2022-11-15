import type {ActionObject} from './lib/action.js';
import Action from './lib/action.js';
import Version from './lib/version.js';
import Plugin from './lib/plugin.js';

// @ts-expect-error: TS2307
import ui from './ui.html';

type SettingsObject = {
	useRfc?: boolean;
	updateName?: boolean;
	useCommitMessage?: boolean;
	saveToFigmaVersionHistory?: boolean;
};

const versionRegex = /@(\d+\.\d+\.\d+(-rfc\.\d+)?)$/im;

/**
 * Derives possible Actions based on current version
 *
 * Returns an array ob possible actions, based on the given version and
 * the current settings.
 */
function deriveActions(node: BaseNode, settings: SettingsObject, version?: Version): ActionObject[] {
	const versionFromName = getVersionFromName(node);
	const actions: ActionObject[] = [{
		version: version ? version.toString() : null,
		label: 'keep',
	}];

	if (version) {
		const options
			= version
				.deriveOptions(settings.useRfc)
				.map(versionObject => {
					const newVersion = new Version(versionObject);
					const label = version.elevatedLevel(newVersion) || 'keep';
					const action = new Action(node, newVersion, label);

					return action.toObject();
				});

		actions.push(...options);
	} else {
		const initialVersion = new Version(undefined, settings.useRfc);
		const action = new Action(node, initialVersion, 'initial');

		actions.push(action.toObject());
	}

	const hasOneVersionUndefined = (!versionFromName !== !version);
	const hasDifferentVersion = (Boolean(versionFromName) && Boolean(version) && !version.equals(versionFromName));
	if (settings.updateName && (hasOneVersionUndefined || hasDifferentVersion)) {
		actions.push({
			nodeId: node.id,
			version: versionFromName ? versionFromName.toString() : undefined,
			label: 'fromName',
		}, {
			nodeId: node.id,
			label: 'toName',
			version: version ? version.toString() : undefined,
			nameVersion: versionFromName ? versionFromName.toString() : undefined,
		});
	}

	const history = Plugin.getHistory(node) || [];

	if (history.length > 1) {
		actions.push({
			nodeId: node.id,
			version: history[1].version.toString(),
			commitMessage: history[1].commitMessage,
			label: 'revert',
		});
	}

	actions.sort((a, b) => Action.getIndex(a.label) - Action.getIndex(b.label));

	return actions;
}

function getVersionFromName(node: BaseNode): undefined | Version {
	const name = node.name;
	const match = versionRegex.exec(name);

	if (match) {
		return new Version(match[1]);
	}

	return undefined;
}

function updateVersionInName(node: BaseNode, version?: Version | string): void {
	const name = node.name;
	const hasVersionInName = getVersionFromName(node) !== undefined;

	if (version === undefined || version === '') {
		node.name = name.replace(versionRegex, '');
	} else {
		const newVersionString = `@${version.toString()}`;

		node.name = hasVersionInName
			? name.replace(versionRegex, newVersionString)
			: `${name}${newVersionString}`;
	}
}

function updateSettings(message: any): void {
	const oldSettings = (Plugin.getConfig('settings') || {}) as SettingsObject;
	const newSettings = {...oldSettings, ...(message.settings as SettingsObject)};

	Plugin.setConfig('settings', newSettings);
}

function updateCommitMessage(message: any): void {
	const node = figma.getNodeById(message.nodeId as string);
	const commitMessage = message.commitMessage as string;
	const history = Plugin.getHistory(node) || [];

	if (history.length > 0 && !history[0].version) {
		history[0].commitMessage = commitMessage;
	} else {
		history.unshift({
			commitMessage,
		});
	}

	Plugin.setHistory(node, history);
}

function resizeUi(_width = 300, height = 600) {
	figma.ui.resize(300, height);
}

function updateVersion(message: any): void {
	const action = message.action as ActionObject;
	const node = figma.getNodeById(action.nodeId);
	const {updateName, useCommitMessage, saveToFigmaVersionHistory} = (Plugin.getConfig('settings') || {}) as SettingsObject;
	const version = action.version ? new Version(action.version) : '';

	Plugin.setVersion(node, version);
	if (updateName) {
		updateVersionInName(node, version);
	}

	if (version !== '') {
		const history = Plugin.getHistory(node) || [];

		if (action.label === 'revert') {
			if (history.length > 0 && history[0].version === undefined) {
				history.shift();
			}

			if (history.length > 0) {
				history[0].version = undefined;
			}
		} else {
			const commitMessage = useCommitMessage ? message.commitMessage as string : undefined;

			if (history.length > 0 && !history[0].version) {
				history[0].version = new Version(version);
				history[0].commitMessage = commitMessage;
			} else {
				history.unshift({
					version: new Version(version),
					commitMessage,
				});
			}
		}

		Plugin.setHistory(node, history);
	}

	if (saveToFigmaVersionHistory
		&& version !== ''
		&& ['major', 'minor', 'patch', 'rfc', 'release', 'initial'].includes(action.label)) {
		const commitMessage = message.commitMessage as string || undefined;
		const name = node.name;
		const titleParts = name.split('@');
		let title = name;

		if (Version.pattern.test(titleParts.slice(-1)[0])) {
			title = titleParts.slice(0, -1).join('@');
		}

		title = `${title}@${version.toString()}`;

		void figma.saveVersionHistoryAsync(title, commitMessage);
	}
}

const selectionChange = (): void => {
	updateUi(true);
};

figma.on('selectionchange', selectionChange);
figma.on('close', () => {
	figma.off('selectionchange', selectionChange);
});

// eslint-disable-next-line unicorn/prefer-add-event-listener
figma.ui.onmessage = message => {
	console.log(message);
	switch (message.type) {
		case 'settings': {
			const settings: SettingsObject = {
				useRfc: false,
				useCommitMessage: false,
				updateName: false,
				saveToFigmaVersionHistory: false,
				...(Plugin.getConfig('settings') as SettingsObject),
			};

			figma.ui.postMessage({
				type: 'settings',
				settings,
			});
			break;
		}

		case 'updateSettings': {
			updateSettings(message);
			updateUi();
			break;
		}

		case 'updateVersion': {
			updateVersion(message);
			updateUi();
			break;
		}

		case 'updateCommitMessage': {
			updateCommitMessage(message);
			break;
		}

		case 'resize': {
			resizeUi(message.width, message.height);
			break;
		}

		default: {
			break;
		}
	}
};

function updateUi(hasSelectionChanged = false) {
	const page = figma.currentPage;
	const selection = page.selection;
	let message = null;
	const uiOptions: ShowUIOptions = {};

	if (selection.length > 0) {
		if (selection.length === 1) {
			const settings = (Plugin.getConfig('settings') || {}) as SettingsObject;
			const node = selection[0] as BaseNode;
			const version = Plugin.getVersion(node);
			const history = Plugin.getHistory(node);
			const actions = deriveActions(node, settings, version);

			uiOptions.title = node.name;
			message = {
				type: 'actions',
				data: actions,
				history,
			};
		} else {
			const selectedNodes = selection.map(node => {
				const versionValue = Plugin.getNode(node, 'version') as string | undefined;
				const version = versionValue ? (new Version(versionValue)).toString() : null;

				return {
					id: node.id,
					name: node.name,
					version,
				};
			});

			message = {
				type: 'list',
				data: selectedNodes,
			};
		}
	} else {
		figma.skipInvisibleInstanceChildren = true;
		const versionedNodes
			= figma.root
				.findAll(node => versionRegex.test(node.name)
					|| Plugin.getVersion(node) !== undefined)
				.map(node => {
					const version = Plugin.getVersion(node) || null;

					return {
						id: node.id,
						name: node.name,
						version,
					};
				});

		figma.skipInvisibleInstanceChildren = false;

		message = {
			type: 'list',
			data: versionedNodes,
		};
	}

	figma.showUI(ui, uiOptions);
	figma.ui.postMessage(message);
}

if (figma.editorType === 'figma') {
	updateUi();
} else {
	figma.closePlugin('Semantic Versioning is currently only running in Figma Design.');
}
