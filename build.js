const inlineStylePlugin = {
	name: 'inlineStyle',
	setup(build) {
		const fs = require('fs');
		const path = require('path');
		const options = build.initialOptions;

		build.onLoad({ filter: /\.html$/ }, async (args) => {
			const styleTagRegex = /<\/style>/gi;
			const headTagRegex = /<\/head>/gi;
			const bodyTagRegex = /<\/body>/gi;
			const htmlPathObject = path.parse(args.path);
			const cssPath = path.format(Object.assign({},
				htmlPathObject,
				{ ext: '.css', base: undefined }
			));
			const jsPath = path.format(Object.assign({},
				htmlPathObject,
				{ ext: '.js', base: undefined }
			));
			const htmlSource = (await fs.promises.readFile(args.path)).toString();
			let jsSource = '';
			let cssSource = '';

			try {
				try {
					cssSource = (await fs.promises.readFile(cssPath)).toString();
				} catch (error) {
					const fallbackCssPath = path.format({
						dir: options.outdir,
						name: htmlPathObject.name,
						ext: '.css'
					});

					cssSource = (await fs.promises.readFile(fallbackCssPath)).toString();
				}

				let newHtmlSource = htmlSource.replace(
					styleTagRegex,
					`${cssSource}\n</style>`
				);

				if (htmlSource.length === newHtmlSource.length) {
					newHtmlSource = htmlSource.replace(
						headTagRegex,
						`<style>\n${cssSource}\n</style>\n</head>`
					);
				}

				try {
					jsSource = (await fs.promises.readFile(jsPath)).toString();
				} catch (error) {
					const fallbackJsPath = path.format({
						dir: options.outdir,
						name: htmlPathObject.name,
						ext: '.js'
					});

					try {
						jsSource = (await fs.promises.readFile(fallbackJsPath)).toString();
					} catch {}
				}

				if (jsSource.length > 0) {
					newHtmlSource = newHtmlSource.replace(
						bodyTagRegex,
						`<script>\n${jsSource}\n</script>\n</body>`
					);
				}

				return { contents: newHtmlSource, loader: 'text' }
			} catch {}
		})
	},
}

const esbuildSvelte = require('esbuild-svelte');
const sveltePreprocess = require('svelte-preprocess');

require('esbuild')
	.build({
		logLevel: 'info',
		entryPoints: ['lib/ui.js'],
		bundle: true,
		outdir: 'dist/',
		platform: 'browser',
		plugins: [
			esbuildSvelte({
				preprocess: sveltePreprocess
			}),
		]
	})
	.catch(() => process.exit(1));

require('esbuild')
	.build({
		logLevel: 'info',
		entryPoints: ['code.ts'],
		bundle: true,
		outdir: 'dist/',
		platform: 'neutral',
		loader: {
			'.html': 'text'
		},
		plugins: [
			inlineStylePlugin
		]
	})
	.catch(() => process.exit(1));

