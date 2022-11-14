import Version from './version.js';

function isAction(object) {
	const properties = ['version', 'nodeId', 'label'];
	if (object === undefined) {
		return false;
	}

	for (const prop of properties) {
		if (!(prop in object)) {
			return false;
		}
	}

	return true;
}

export default class Action {
	constructor(actionOrNode, version, label) {
		if (isAction(actionOrNode)) {
			this.version = actionOrNode.version;
			this.nodeId = actionOrNode.nodeId;
			this.label = actionOrNode.label;
		} else if (typeof actionOrNode === 'string') {
			const action = JSON.parse(actionOrNode);
			this.version = action.version ? null : new Version(action.version);
			this.nodeId = action.nodeId;
			this.label = action.label;
		} else {
			this.version = version;
			this.nodeId = actionOrNode.id;
			this.label = label;
		}
	}

	static getIndex(label) {
		const index = Action.orderedActions.indexOf(label);
		if (index === -1) {
			throw new ReferenceError(`No index for unknown laben "${label}".`);
		}

		return index;
	}

	toString() {
		return JSON.stringify(this.toObject());
	}

	toObject() {
		return {
			version: this.version.toString(),
			nodeId: this.nodeId,
			label: this.label,
		};
	}
}
Action.orderedActions = [
	'keep',
	'initial',
	'rfc',
	'release',
	'patch',
	'minor',
	'major',
	'revert',
	'toName',
	'fromName',
];
