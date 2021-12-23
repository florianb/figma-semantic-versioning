/* eslint @typescript-eslint/no-unnecessary-type-assertion: "off" */

export interface VersionObject {
	major: number;
	minor: number;
	patch: number;
	rfc?: number;
}

function isVersion(object: any): object is Version {
	const properties = ['major', 'minor', 'patch', 'rfc'];

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

export default class Version {
	public static levels: string[] = ['major', 'minor', 'patch', 'rfc'];

	major: number;
	minor: number;
	patch: number;
	rfc?: number;

	constructor(version?: VersionObject | Version | string, useRfc?: boolean) {
		let newVersion: VersionObject;

		if (typeof version === 'string') {
			const [major, minor, patch, rfc]
				= version.split(/\.|-rfc\./)
					.map(level => level ? Number.parseInt(level, 10) : undefined);

			newVersion = {
				major,
				minor,
				patch,
				rfc,
			};
		} else if (isVersion(version)) {
			newVersion = (version as Version).toObject();
		} else if (typeof version === 'object') {
			newVersion = version;
		} else {
			newVersion = {
				major: 1,
				minor: 0,
				patch: 0,
				rfc: useRfc ? 1 : undefined,
			};
		}

		this.major = newVersion.major;
		this.minor = newVersion.minor;
		this.patch = newVersion.patch;
		this.rfc = newVersion.rfc;
	}

	toString(): string {
		const appendix = this.rfc === undefined ? '' : `-rfc.${this.rfc}`;

		return `${this.major}.${this.minor}.${this.patch}${appendix}`;
	}

	toObject(): VersionObject {
		const {...newObject} = this;

		return newObject;
	}

	deriveOptions(useRfc: boolean): VersionObject[] {
		const isRfc: boolean = this.rfc !== undefined;
		const newRfc: number | undefined = isRfc && useRfc ? undefined : 1;
		const baseVersion: VersionObject = this.toObject();

		const options: VersionObject[] = [
			{
				major: baseVersion.major + 1,
				minor: 0,
				patch: 0,
				rfc: newRfc,
			},
			{
				...baseVersion,
				minor: baseVersion.minor + 1,
				patch: 0,
				rfc: newRfc,
			},
			{
				...baseVersion,
				patch: baseVersion.patch + 1,
				rfc: newRfc,
			},
		];

		if (useRfc && isRfc) {
			options.push({
				...baseVersion,
				rfc: baseVersion.rfc + 1,
			});
		}

		return options;
	}

	elevatedLevel(otherVersion: Version): string | void {
		for (const level of Version.levels) {
			if (this[level] !== otherVersion[level]) {
				return level;
			}
		}

		return undefined;
	}
}
