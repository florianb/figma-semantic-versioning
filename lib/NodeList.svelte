<ul>
	{#each nodes as node} 
		<li>"{node.name}" {node.version || 'not versioned'}</li>
	{/each}
</ul>

<script>
	export let nodes = [];
</script>
