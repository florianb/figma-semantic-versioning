<div class="body">
	{#if type === 'list'}
		<NodeList nodes={data}/>
	{:else if type === 'actions'}
		<ActionList actions={data}/>
	{/if}

	{#if settings !== null}
		<Settings useRfc={settings.useRfc} updateName={settings.updateName}/>
	{/if}
</div>

<script>
	import {onMount} from 'svelte';
	import Settings from './Settings.svelte';
	import NodeList from './NodeList.svelte';
	import ActionList from './ActionList.svelte';

	let type = 'loading';
	let data = null;
	let settings = null;

	onMount(() => {
		parent.postMessage({pluginMessage: {type: 'settings'}}, '*');
	});
	
	window.onmessage = (event) => {
		const message = event.data.pluginMessage;

		// console.log('ui received', message);

		switch (message.type) {
			case 'settings':
				settings = message.settings;
					break;
			default:
				type = message.type;
				data = message.data;
				break;
		}
	}
</script>

<style>
.body {
	font-family: Inter, sans-serif;
	font-feature-settings: "liga", "calt";
	font-size: 12px;
	font-weight: 400;
	font-stretch: 100%;
}
</style>
