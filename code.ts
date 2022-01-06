import Action, {ActionObject} from './lib/action.js';
import Version from './lib/version.js';
import Plugin from './lib/plugin.js';

// @ts-expect-error: TS2307
import ui from './ui.html';

const versionRegex = /@(\d+\.\d+\.\d+(-rfc\.\d+)?)$/im;

function deriveActions(node: BaseNode, version?: Version, useRfc?: boolean, updateName?: boolean): ActionObject[] {
	const versionFromName = getVersionFromName(node);
	const actions: ActionObject[] = [{
		version: version ? version.toString() : null,
		label: 'keep',
	}];

	if (version) {
		const options
			= version
				.deriveOptions(useRfc === true)
				.map(versionObject => {
					const newVersion = new Version(versionObject);
					const label = version.elevatedLevel(newVersion) || 'keep';
					const action = new Action(node, newVersion, label);

					return action.toObject();
				});

		actions.push(...options);
	} else {
		const initialVersion = new Version(undefined, useRfc === true);
		const action = new Action(node, initialVersion, 'initial');
		
		actions.push(action.toObject());
	}

	const hasOneVersionUndefined = (!versionFromName !== !version);
	const hasDifferentVersion = (!!versionFromName && !!version && !version.equals(versionFromName));
	if (updateName && (hasOneVersionUndefined || hasDifferentVersion)) {
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

figma.ui.onmessage = message => {
	switch (message.type) {
		case 'settings':
			const settings = {
				useRfc: false,
				updateName: false,
				...Plugin.getConfig('settings'),
			};

			figma.ui.postMessage({
				type: 'settings',
				settings,
			});

			break;
		case 'updateSettings':
			const oldSettings = Plugin.getConfig('settings') || {};
			const newSettings = {...oldSettings, ...message.settings};

			Plugin.setConfig('settings', newSettings);

			updateUi();
			break;
		case 'updateVersion':
			const action = message.action
			const node = figma.getNodeById(action.nodeId);
			const {updateName} = Plugin.getConfig('settings') || {};
			const version = action.version ? new Version(action.version) : '';

			Plugin.setVersion(node, version);
			if (updateName) {
				updateVersionInName(node, version);
			}

			updateUi();
			break;
		default:
	}
};

function updateUi() {
	const page = figma.currentPage;
	const selection = page.selection;

	if (selection.length > 0) {
		let message = null;

		if (selection.length === 1) {
			const {useRfc, updateName} = Plugin.getConfig('settings') || {};
			const node = selection[0];
			const version = Plugin.getVersion(node);

			const actions = deriveActions(node, version, useRfc, updateName);

			message = {
				type: 'actions',
				data: actions,
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

		figma.ui.postMessage(message);
	} else {
		figma.closePlugin('Butterfly requires selected Nodes.');
	}
}

if (figma.editorType === 'figma') {
	figma.showUI(ui);
	updateUi();
} else {
	figma.closePlugin('Butterfly is currently only running in classic Figma.');
}
