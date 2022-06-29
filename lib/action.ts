import Version from './version.js';

function isAction(object: any): object is Action {
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

export interface ActionObject {
	version: string;
	nodeId?: string;
	label: string;
	nameVersion?: string;
	commitMessage?: string;
}

export default class Action {
	public static readonly orderedActions = [
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

	public static getIndex(label: string): number {
		const index = Action.orderedActions.indexOf(label);

		if (index === -1) {
			throw new ReferenceError(`No index for unknown laben "${label}".`);
		}

		return index;
	}

	version: Version;
	nodeId?: string;
	label: string;

	constructor(action: Action | string);
	constructor(node: BaseNode, version: Version | undefined, label: string);
	constructor(actionOrNode: Action | string | BaseNode, version?: Version | undefined, label?: string) {
		if (isAction(actionOrNode)) {
			this.version = actionOrNode.version;
			this.nodeId = actionOrNode.nodeId;
			this.label = actionOrNode.label;
		} else if (typeof actionOrNode === 'string') {
			const action = JSON.parse(actionOrNode) as ActionObject;

			this.version = action.version ? null : new Version(action.version);
			this.nodeId = action.nodeId;
			this.label = action.label;
		} else {
			this.version = version;
			this.nodeId = actionOrNode.id;
			this.label = label;
		}
	}

	toString(): string {
		return JSON.stringify(this.toObject());
	}

	toObject(): ActionObject {
		return {
			version: this.version.toString(),
			nodeId: this.nodeId,
			label: this.label,
		};
	}
}
