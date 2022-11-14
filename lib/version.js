/* eslint @typescript-eslint/no-unnecessary-type-assertion: "off" */
const __rest = (this && this.__rest) || function (s, e) {
	const t = {};
	for (var p in s) {
		if (Object.prototype.hasOwnProperty.call(s, p) && !e.includes(p)) {
			t[p] = s[p];
		}
	}

	if (s != null && typeof Object.getOwnPropertySymbols === 'function') {
		for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
			if (!e.includes(p[i]) && Object.prototype.propertyIsEnumerable.call(s, p[i])) {
				t[p[i]] = s[p[i]];
			}
		}
	}

	return t;
};

function isVersion(object) {
	return object instanceof Version;
}

export default class Version {
	constructor(version, useRfc) {
		let newVersion;
		if (typeof version === 'string') {
			const [major, minor, patch, rfc] = version.split(/\.|-rfc\./)
				.map(level => level ? Number.parseInt(level, 10) : undefined);
			newVersion = {
				major,
				minor,
				patch,
				rfc,
			};
		} else if (isVersion(version)) {
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

	toString() {
		const appendix = this.rfc === undefined ? '' : `-rfc.${this.rfc}`;
		return `${this.major}.${this.minor}.${this.patch}${appendix}`;
	}

	toObject() {
		const newObject = __rest(this, []);
		return newObject;
	}

	deriveOptions(useRfc) {
		const newRfc = useRfc ? 1 : undefined;
		const baseVersion = this.toObject();
		const options = [
			{
				major: baseVersion.major + 1,
				minor: 0,
				patch: 0,
				rfc: newRfc,
			},
			Object.assign(Object.assign({}, baseVersion), {minor: baseVersion.minor + 1, patch: 0, rfc: newRfc}),
			Object.assign(Object.assign({}, baseVersion), {patch: baseVersion.patch + 1, rfc: newRfc}),
		];
		if (useRfc && baseVersion.rfc) {
			options.push(Object.assign(Object.assign({}, baseVersion), {rfc: baseVersion.rfc + 1}));
		}

		if (baseVersion.rfc) {
			options.push(Object.assign(Object.assign({}, baseVersion), {rfc: undefined}));
		}

		return options;
	}

	elevatedLevel(otherVersion) {
		for (const level of Version.levels) {
			if (level === 'rfc' && !otherVersion[level] && this[level]) {
				return 'release';
			}

			if (this[level] !== otherVersion[level]) {
				return level;
			}
		}

		return undefined;
	}

	equals(otherVersion) {
		return this.major === otherVersion.major
            && this.minor === otherVersion.minor
            && this.patch === otherVersion.patch
            && this.rfc === otherVersion.rfc;
	}
}
Version.levels = ['major', 'minor', 'patch', 'rfc'];
Version.pattern = /\d+\.\d+\.\d+(-rfc\.\d+)?$/im;
