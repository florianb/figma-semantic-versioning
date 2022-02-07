<script>
	export let useRfc = null;
	export let useCommitMessage = null;
	export let updateName = null;

	function setUseRfc(useRfc) {
		parent.postMessage(
			{
				pluginMessage: {
					type: "updateSettings",
					settings: {
						useRfc,
					},
				},
			},
			"*"
		);
	}

	function setUpdateName(updateName) {
		parent.postMessage(
			{
				pluginMessage: {
					type: "updateSettings",
					settings: {
						updateName,
					},
				},
			},
			"*"
		);
	}

	function setUseCommitMessage(useCommitMessage) {
		parent.postMessage(
			{
				pluginMessage: {
					type: "updateSettings",
					settings: {
						useCommitMessage,
					},
				},
			},
			"*"
		);
	}
</script>

<details>
	<summary>Documentwide Settings</summary>

	{#if useRfc !== null}
		<div>
			<input
				type="checkbox"
				id="use-rfc"
				bind:checked={useRfc}
				on:change={setUseRfc(useRfc)}
			/>
			<label for="use-rfc">Use "request for comments" workflow.</label>
		</div>
	{/if}

	{#if useCommitMessage !== null}
		<div>
			<input
				type="checkbox"
				id="use-commit-message"
				bind:checked={useCommitMessage}
				on:change={setUseCommitMessage(useCommitMessage)}
			/>
			<label for="use-commit-message">Use commit messages.</label>
		</div>
	{/if}

	{#if updateName !== null}
		<div>
			<input
				type="checkbox"
				id="update-name"
				bind:checked={updateName}
				on:change={setUpdateName(updateName)}
			/>
			<label for="update-name"
				>Use version appendix (f.e. "@1.0.0") at Node names.</label
			>
		</div>
	{/if}
</details>

<style>
	details {
		margin-top: 2ex;
		padding: 1.2ex;

		border-top: 1px solid #e2e2e2;

		font-size: 10px;
		color: #888;
	}

	summary {
		font-weight: 600;
		margin-bottom: 1ex;
	}

	details:hover {
		color: #333;
	}
</style>
