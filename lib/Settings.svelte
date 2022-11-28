<script>
	export let useRfc = null;
	export let useCommitMessage = null;
	export let updateName = null;
	export let saveToFigmaVersionHistory = null;

	function setSetting(name, value) {
		parent.postMessage(
			{
				pluginMessage: {
					type: "updateSettings",
					settings: {
						[name]: value,
					},
				},
			},
			"*"
		);
	}
</script>

<details>
	<summary>Pagewide Settings</summary>

	{#if useRfc !== null}
		<div>
			<label for="use-rfc">
				<input
					type="checkbox"
					id="use-rfc"
					bind:checked={useRfc}
					on:change={setSetting("useRfc", useRfc)}
				/>
				Use "request for comments" workflow.</label
			>
		</div>
	{/if}

	{#if useCommitMessage !== null}
		<div>
			<label for="use-commit-message">
				<input
					type="checkbox"
					id="use-commit-message"
					bind:checked={useCommitMessage}
					on:change={setSetting("useCommitMessage", useCommitMessage)}
				/>
				Use commit messages.</label
			>
		</div>
	{/if}

	{#if updateName !== null}
		<div>
			<label for="update-name">
				<input
					type="checkbox"
					id="update-name"
					bind:checked={updateName}
					on:change={setSetting("updateName", updateName)}
				/>
				Use version appendix (f.e. "@1.0.0") at Node names.</label
			>
		</div>
	{/if}

	{#if saveToFigmaVersionHistory !== null}
		<div>
			<label for="save-to-figma-version-history">
				<input
					type="checkbox"
					id="save-to-figma-version-history"
					bind:checked={saveToFigmaVersionHistory}
					on:change={setSetting(
						"saveToFigmaVersionHistory",
						saveToFigmaVersionHistory
					)}
				/>
				Issue the save of a new Figma file version alongside with the save of
				a new version tag ("Major", "Minor", "Patch", "Request for Comments",
				"Release" and "Initial").</label
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

	details div {
		margin: 2ex 0;
	}
	details div label input {
		margin: 0;
	}
	details div label {
		display: flex;
		gap: 1ex;
		align-items: center;
	}
</style>
