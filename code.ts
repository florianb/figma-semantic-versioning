import Action, {ActionObject} from './lib/action.js';
import Version from './lib/version.js';
import Plugin from './lib/plugin.js';

// @ts-expect-error: TS2307
import ui from './ui.html';

function deriveActions(node: BaseNode, version?: Version, useRfc?: boolean): ActionObject[] {
	const actions: ActionObject[] = [{
		version: version ? version.toString() : null,
		label: 'keep',
	}];

	if (version) {
		const options
			= version
				.deriveOptions(useRfc)
				.map(versionObject => {
					const newVersion = new Version(versionObject);
					const label = version.elevatedLevel(newVersion) || 'keep';

					return (new Action(node, newVersion, label)).toObject();
				});

		actions.push(...options);
	} else {
		const initialVersion = new Version(undefined, useRfc);
		const action = new Action(node, initialVersion, 'initial');
		
		actions.push(action.toObject());
	}

	return actions;
}

figma.ui.onmessage = message => {
	console.log('message:', message);

	switch (message.type) {
		case 'settings':
			const settings = {
				useRfc: (Plugin.config('useRfcWorkflow') as boolean) || false,
			};

			console.log('setting', settings);
			figma.ui.postMessage({
				type: 'settings',
				settings,
			});

			break;
		case 'updateSettings':
			Plugin.config('useRfcWorkflow', message.settings.useRfc);

			break;
		default:
	}
};

if (figma.editorType === 'figma') {
	const page = figma.currentPage;
	const user = figma.currentUser;
	const selection = page.selection;

	if (selection.length > 0) {
		let message = null;

		if (selection.length === 1) {
			const useRfc = Plugin.config('useRfcWorkflow') as boolean;
			const node = selection[0];
			const version = Plugin.version(node);

			const actions = deriveActions(node, version, useRfc);

			message = {
				type: 'actions',
				data: actions,
			};
		} else {
			const selectedNodes = selection.map(node => {
				const versionValue = Plugin.node(node, 'version') as string | undefined;
				const version = versionValue ? new Version(versionValue) : null;

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

		figma.showUI(ui);
		figma.ui.postMessage(message);
	} else {
		figma.closePlugin('Butterfly requires selected Nodes.');
	}
}
