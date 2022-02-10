<script>
	import { debounce } from "lodash";
	import { onMount } from "svelte";
	import Settings from "./Settings.svelte";
	import NodeList from "./NodeList.svelte";
	import ActionList from "./ActionList.svelte";

	let type = "loading";
	let data = null;
	let history = null;
	let settings = null;
	let commitMessage = null;

	onMount(() => {
		parent.postMessage({ pluginMessage: { type: "settings" } }, "*");
	});

	const resizeUi = debounce((node) => {
		if (node) {
			parent.postMessage(
				{
					pluginMessage: {
						type: "resize",
						width: node.offsetWidth,
						height: node.offsetHeight,
					},
				},
				"*"
			);
		}
	}, 66);

	window.onmessage = (event) => {
		const message = event.data.pluginMessage;

		switch (message.type) {
			case "settings":
				settings = message.settings;
				break;
			default:
				type = message.type;
				data = message.data;
				history = message.history;

				if (
					history &&
					history.length > 0 &&
					!history[0].version &&
					history[0].commitMessage
				) {
					commitMessage = history[0].commitMessage;
				}
				break;
		}
	};
</script>

<div class="body" use:resizeUi>
	{#if type === "list"}
		<NodeList nodes={data} />
	{:else if type === "actions"}
		<ActionList
			actions={data}
			{commitMessage}
			useCommitMessage={settings && settings.useCommitMessage}
		/>
	{/if}

	{#if settings !== null}
		<Settings
			useRfc={settings.useRfc}
			useCommitMessage={settings.useCommitMessage}
			updateName={settings.updateName}
			saveToFigmaVersionHistory={settings.saveToFigmaVersionHistory}
		/>
	{/if}
</div>

<style>
	.body {
		font-family: Inter, sans-serif;
		font-feature-settings: "liga", "calt";
		font-size: 12px;
		font-weight: 400;
		font-stretch: 100%;
		padding: 1ex 1em;
	}
</style>
