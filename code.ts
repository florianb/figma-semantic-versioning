import Action, {ActionObject} from './lib/action.js'
import Version from './lib/version.js'
import Plugin from './lib/plugin.js'

// @ts-ignore
import ui from './ui.html'

function deriveActions(node: BaseNode, version?: Version, useRfc?: boolean): ActionObject[] {
	const actions: ActionObject[] = [{
		version: version ? null : version.toString(),
		label: 'keep'
	}];

	if (version) {
		const options
			= version
				.deriveOptions(useRfc)
				.map(versionObject => {
					const newVersion = new Version(versionObject);
					const label = version.elevatedLevel(newVersion) || 'keep';

					return (new Action(node, newVersion, label)).toObject()
				});

		actions.push(...options);
	}

	return actions;
}

figma.ui.onmessage = message => {
	//console.log(message);
};

if (figma.editorType === 'figma') {
	const page = figma.currentPage;
	const user = figma.currentUser;
	const selection = page.selection;

	if (selection.length >= 1) {
		if (selection.length === 1) {
			const useRfc = Plugin.config('useRfcWorkflow') as boolean;
		} else {
			const selectedNodes = selection.map(node => {
				const versionValue = Plugin.node(node, 'version');
				const version = versionValue ? new Version(versionValue) : null;

				return {
					id: node.id,
					name: node.name,
					version
				};
			});
		}

		figma.showUI(ui);
	}
}
