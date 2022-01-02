<div>
	{#each actions as action} 
		<input
			type="radio"
			name="action"
			id={action.label}
			value={action.label}
			bind:group={selection}
		>
		<label for={action.label}>
			{action.version || 'unversioniert'}
		</label>
	{/each}
</div>

<button
	on:click={saveAction(selection, actions)}
	disabled={!selection || selection === 'keep'}>save</button>

<script>
	export let actions = [];

	function resetSelection(actions) {
		if (actions.find(a => a.label === 'keep') && selection !== 'keep') {
			return 'keep';
		}

		return selection;
	}

	function saveAction(selection, actions) {
		const action = actions.find(a => a.label === selection);

		console.log(selection, actions, action);

		parent.postMessage({
			pluginMessage: {
				type: 'updateVersion',
				action,
			}
		}, '*');
	}

	$: selection = resetSelection(actions);
</script>
