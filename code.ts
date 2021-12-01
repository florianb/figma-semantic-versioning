import Action, {ActionObject} from './lib/action.js'
import Version from './lib/version.js'
import Plugin from './lib/plugin.js'

function deriveActions(version: Version): ActionObject[] {
	return [];
}

if (figma.editorType === 'figma') {
	const page = figma.currentPage;
	const user = figma.currentUser;
	const selection = page.selection;
	const useRfc = Plugin.config('useRfcWorkflow') as boolean;

	figma.showUI(__html__);

}
