import {env} from 'node:process';
import {format, parse} from 'node:path';
import {promises} from 'node:fs';

import esbuildSvelte from 'esbuild-svelte';
import sveltePreprocess from 'svelte-preprocess';

import esbuild from 'esbuild';

const inlineStylePlugin = {
	name: 'inlineStyle',
	setup(build) {
		const options = build.initialOptions;

		build.onLoad({filter: /\.html$/}, async args => {
			const styleTagRegex = /<\/style>/gi;
			const headTagRegex = /<\/head>/gi;
			const bodyTagRegex = /<\/body>/gi;
			const htmlPathObject = parse(args.path);
			const cssPath = format(Object.assign({},
				htmlPathObject,
				{ext: '.css', base: undefined},
			));
			const jsPath = format(Object.assign({},
				htmlPathObject,
				{ext: '.js', base: undefined},
			));
			let fileContents = await promises.readFile(args.path);
			const htmlSource = fileContents.toString();
			let jsSource = '';
			let cssSource = '';

			try {
				try {
					fileContents = await promises.readFile(cssPath);
					cssSource = fileContents.toString();
				} catch {
					const fallbackCssPath = format({
						dir: options.outdir,
						name: htmlPathObject.name,
						ext: '.css',
					});

					fileContents = await promises.readFile(fallbackCssPath);
					cssSource = fileContents.toString();
				}

				let newHtmlSource = htmlSource.replace(
					styleTagRegex,
					`${cssSource}\n</style>`,
				);

				if (htmlSource.length === newHtmlSource.length) {
					newHtmlSource = htmlSource.replace(
						headTagRegex,
						`<style>\n${cssSource}\n</style>\n</head>`,
					);
				}

				try {
					fileContents = await promises.readFile(jsPath);
					jsSource = fileContents.toString();
				} catch (error) { // eslint-disable-line no-unused-vars, unicorn/prefer-optional-catch-binding
					const fallbackJsPath = format({
						dir: options.outdir,
						name: htmlPathObject.name,
						ext: '.js',
					});

					try {
						fileContents = await promises.readFile(fallbackJsPath);
						jsSource = fileContents.toString();
					} catch {}
				}

				if (jsSource.length > 0) {
					newHtmlSource = newHtmlSource.replace(
						bodyTagRegex,
						`<script>\n${jsSource}\n</script>\n</body>`,
					);
				}

				return {contents: newHtmlSource, loader: 'text'};
			} catch {}
		});
	},
};

const defaults = {
	target: ['es6'],
	logLevel: 'info',
	bundle: true,
	outdir: 'dist/',
	minify: env.NODE_ENV !== 'dev',
	sourcemap: env.NODE_ENV === 'dev',
};

esbuild
	.build(Object.assign({}, defaults, {
		entryPoints: ['lib/ui.js'],
		platform: 'browser',
		plugins: [
			esbuildSvelte({
				preprocess: sveltePreprocess,
			}),
		],
	}))
	.catch(() => {
		throw new Error('Building ui.js failed');
	});

esbuild
	.build(Object.assign({}, defaults, {
		entryPoints: ['code.ts'],
		platform: 'neutral',
		loader: {
			'.html': 'text',
		},
		plugins: [
			inlineStylePlugin,
		],
	}))
	.catch(() => {
		throw new Error('Building code.js failed');
	});

