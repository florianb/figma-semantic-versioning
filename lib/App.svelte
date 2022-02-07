<script>
	import { onMount } from "svelte";
	import Settings from "./Settings.svelte";
	import NodeList from "./NodeList.svelte";
	import ActionList from "./ActionList.svelte";

	let type = "loading";
	let data = null;
	let settings = null;
	let commitMessage = null;

	onMount(() => {
		parent.postMessage({ pluginMessage: { type: "settings" } }, "*");
	});

	window.onmessage = (event) => {
		const message = event.data.pluginMessage;

		// console.log('ui received', message);

		switch (message.type) {
			case "settings":
				settings = message.settings;
				break;
			default:
				type = message.type;
				data = message.data;
				commitMessage = message.commitMessage;
				break;
		}
	};
</script>

<div class="body">
	{#if type === "list"}
		<NodeList nodes={data} />
	{:else if type === "actions"}
		<ActionList
			actions={data}
			useCommitMessage={settings.useCommitMessage}
			{commitMessage}
		/>
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
