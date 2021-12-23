<ul>
	{#each nodes as node} 
		<li>{node.id} {node.name} {node.version || 'unversioniert'}</li>
	{/each}
</ul>

<script>
	export let nodes = [];
</script>
