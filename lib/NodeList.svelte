<script>
	export let nodes = [];

	function select(nodeId) {
		parent.postMessage(
			{
				pluginMessage: {
					type: "select",
					nodeId,
				},
			},
			"*"
		);
	}
</script>

<table>
	<tr>
		<th>Name</th>
		<th>Version</th>
	</tr>
	{#each nodes as node}
		<tr on:click={select(node.id)}>
			<td>{node.name}</td>
			<td class="version">{node.version || "not versioned"}</td>
		</tr>
	{/each}
</table>

<style>
	table {
		border-collapse: collapse;
		border: none !important;
		font-size: 12px;
		font-weight: 400;
		text-align: left;
		table-layout: auto;
		width: 95%;
	}

	th {
		font-size: 10px;
		font-weight: 600;
		color: #333;
		margin: 0;
		margin-bottom: 2px;
	}

	table > tr > th {
		width: 70%;
	}

	.version {
		font-variant-numeric: tabular-nums lining-nums;
	}

	td {
		padding: 1ex 0.4ex 0.8ex 0.4ex;
		margin: 0;
		margin-bottom: 0.2ex;
		color: #444;
	}

	tr:hover {
		color: #000;
		background-color: #daebf7;
		cursor: pointer;
	}
</style>
