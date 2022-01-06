<div class="container">
	{#each actions as action} 
		<div class="list-element">
			<input
				type="radio"
				name="action"
				id={action.label}
				value={action.label}
				bind:group={selection}
			>
			<label for={action.label}>
				<div class="header">
					{labels[action.label].label}
					{#if labels[action.label].description}
						<span class="description">&ndash;&nbsp;{labels[action.label].description}</span>
					{/if}
				</div>
				<div class="body">
					{#if action.label !== 'keep'}
						{#if action.label === 'toName'}@{/if}{currentVersionFor(action.label)} &rarr;
					{/if}
					{#if action.label === 'toName' && action.version}@{/if}{action.version || 'not versioned'}
				</div>
			</label>
		</div>
	{/each}
</div>

<button
	on:click={saveAction(selection, actions)}
	disabled={!selection || selection === 'keep'}>save</button>

<script>
	export let actions = [];
	let selection = 'keep';
	const labels = {
		keep: {
			label: 'Keep',
			description: '',
		},
		initial: {
			label: 'Initial',
			description: 'Start versioning for node',
		},
		major: {
			label: 'Major',
			description: 'Change breaks backend',
		},
		minor: {
			label: 'Minor',
			description: 'Change might affect backend',
		},
		patch: {
				label: 'Patch',
			description: 'Fix not affecting backend',
		},
		rfc: {
			label: 'Request for comments',
			description: 'New iteration for draft',
		},
		release: {
			label: 'Release',
			description: '',
		},
		fromName: {
			label: 'From Name',
			description: 'Set version from postfix',
		},
		toName: {
			label: 'To Name',
			description: 'Set postfix from version',
		},
	};

	function currentVersionFor(label) {
		const currentAction = actions.find(a => a.label === label);

		if (label === 'toName') {
			return currentAction.nameVersion;
		} else {
			const action = actions.find(a => a.label === 'keep');

			return action.version || 'not versioned';
		}
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
</script>

<style>
	.container {
		padding: 2px;
	}

	input {
		vertical-align: super;
	}

	label {
		display: inline-block;
	}

	.list-element {
		margin-bottom: 6px;
	}

	.header {
		font-size: 10px;
		font-weight: 600;
		color: #444;
	}

	.description {
		font-weight: 400;
		color: #555;
	}

	.body {
		margin-top: 1px;
		font-size: 14px;
	}
</style>
