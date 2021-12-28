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

<button disabled={selection === 'keep'}>save</button>

<script>
	export let actions = [];

	let selection = 'keep';
</script>
