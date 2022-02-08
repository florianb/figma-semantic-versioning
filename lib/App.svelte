<script>
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

<div class="body">
	{#if type === "list"}
		<NodeList nodes={data} />
	{:else if type === "actions"}
		<ActionList actions={data} {commitMessage} {settings} />
	{/if}

	{#if settings !== null}
		<Settings
			useRfc={settings.useRfc}
			useCommitMessage={settings.useCommitMessage}
			updateName={settings.updateName}
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
	}
</style>
