<table>
	<tr>
		<th>Name</th>
		<th>Version</th>
	</tr>
	{#each nodes as node} 
	<tr>
		<td>{node.name}</td>
		<td class="version">{node.version || 'not versioned'}</td>
	</tr>
	{/each}
</table>

<style>
	table {
		font-size: 11px;
		font-weight: 400;
		text-align: left;
		table-layout: fixed;
		width: 100%;
	}

	th {
		font-size: 10px;
		font-weight: 600;
		color: #333;
		margin-bottom: 2px;
	}

	table > tr > th {
		width: 70%
	}

	.version {
		font-variant-numeric: tabular-nums lining-nums;
	}
</style>

<script>
	export let nodes = [];
</script>
