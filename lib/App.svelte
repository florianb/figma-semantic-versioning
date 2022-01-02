{#if type === 'list'}
	<NodeList nodes={data}/>
{:else if type === 'actions'}
	<ActionList actions={data}/>
{/if}

{#if settings !== null}
	<Settings useRfc={settings.useRfc}/>
{/if}

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

		console.log(message.type);

		switch (message.type) {
			case 'settings':
				settings = message.settings;
				break;
			default:
				type = message.type;
				data = message.data;

				console.log(data);
		}
	}
</script>

