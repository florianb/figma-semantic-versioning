<p>
	{ type }<br>

	{ data === null ? 'Keine' : data.length } Daten-Elemente
	{#if type === 'list'}
		<NodeList nodes={data}/>
	{/if}
</p>

<script>
	import NodeList from './NodeList.svelte';

	let type = 'loading';
	let data = null;

	window.onmessage = (event) => {
			const message = event.data.pluginMessage;

			type = message.type;
			data = message.data;

			console.log(data);
		}
</script>

