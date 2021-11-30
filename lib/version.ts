interface VersionObject {
	major: number;
	minor: number;
	patch: number;
	rfc?: number;
}

export default class Version implements VersionObject {
	public static levels: string[] = ['major', 'minor', 'patch', 'rfc'];

	major: number;
	minor: number;
	patch: number;
	rfc?: number;

	constructor(version?: VersionObject | Version, useRfc?: boolean) {
		let newVersion: VersionObject;
		if (version instanceof Version) {
			newVersion = version.toObject();
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

	fromString(version: string): Version {
		const [major, minor, patch, rfc]
			= version.split(/\.|-rfc\./)
				.map(level => level ? Number.parseInt(level, 10) : undefined);

		return new Version({
			major,
			minor,
			patch,
			rfc,
		});
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

		return [
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
	}
}
