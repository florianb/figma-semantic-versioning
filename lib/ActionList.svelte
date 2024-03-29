<script>
	import { debounce } from "lodash";

	export let actions = [];
	export let commitMessage = null;
	export let useCommitMessage = null;

	let selection = "keep";

	const commitMessageMaxLength = 144;
	const labels = {
		keep: {
			label: "Keep",
			description: "",
		},
		initial: {
			label: "Initial",
			description: "Start versioning for node",
		},
		major: {
			label: "Major",
			description: "Change may break backend",
		},
		minor: {
			label: "Minor",
			description: "Change may affect backend",
		},
		patch: {
			label: "Patch",
			description: "Fix not affecting backend",
		},
		rfc: {
			label: "Request for Comments",
			description: "New iteration for draft",
		},
		release: {
			label: "Release",
			description: "",
		},
		fromName: {
			label: "From Appendix",
			description: "Set inner version by appendix",
		},
		toName: {
			label: "To Appendix",
			description: "Set appendix by inner version",
		},
		revert: {
			label: "Revert",
			description: "Revert version tag to previous",
		},
	};

	$: isCommitMessageDisabled = [
		"keep",
		"revert",
		"fromName",
		"toName",
	].includes(selection);
	$: commitMessageRemainingCharacters =
		commitMessageMaxLength -
		(commitMessage !== null ? commitMessage.length : 0);

	function currentVersionFor(label) {
		const currentAction = actions.find((a) => a.label === label);

		if (label === "toName") {
			return currentAction.nameVersion;
		} else {
			const action = actions.find((a) => a.label === "keep");

			return action.version || "not versioned";
		}
	}

	function saveAction(selection, actions) {
		const action = actions.find((a) => a.label === selection);

		parent.postMessage(
			{
				pluginMessage: {
					type: "updateVersion",
					commitMessage: useCommitMessage ? commitMessage : undefined,
					action,
				},
			},
			"*"
		);

		selection = "keep";
	}

	const updateCommitMessage = debounce((e) => {
		const action = actions.find((a) => a.nodeId);
		const nodeId = action.nodeId;

		parent.postMessage(
			{
				pluginMessage: {
					type: "updateCommitMessage",
					commitMessage: e.target.value,
					nodeId,
				},
			},
			"*"
		);
	}, 266);
</script>

<div class="container">
	<h4>Available Options</h4>
	{#each actions as action}
		<div class="list-element">
			<input
				type="radio"
				name="action"
				id={action.label}
				value={action.label}
				bind:group={selection}
			/>
			<label for={action.label}>
				<div class="header">
					{labels[action.label].label}
					{#if labels[action.label].description}
						<span class="description"
							>&middot;&nbsp;{labels[action.label].description}</span
						>
					{/if}
				</div>
				<div class="body">
					{#if action.label !== "keep"}
						{#if action.label === "toName"}@{/if}{currentVersionFor(
							action.label
						)} &rarr;
					{/if}
					{#if action.label === "toName" && action.version}@{/if}{action.version ||
						"not versioned"}
				</div>
			</label>
		</div>
	{/each}
</div>

{#if useCommitMessage}
	<label class="textarea-label" for="commit-message"
		>{commitMessageRemainingCharacters}</label
	>
	<div class="centered">
		<textarea
			id="commit-message"
			bind:value={commitMessage}
			disabled={isCommitMessageDisabled}
			on:input={updateCommitMessage}
			rows="3"
			maxlength="144"
			placeholder="What is changing with your release?"
		/>
	</div>
{/if}

<div class="centered">
	<button
		on:click={saveAction(selection, actions)}
		disabled={!selection || selection === "keep"}
	>
		save
	</button>
</div>

<style>
	.container {
		padding: 2px;
	}

	.container h4 {
		font-size: 10px;
		color: #777;
		margin-top: 0;
		margin-bottom: 1ex;
	}

	input {
		vertical-align: super;
	}

	label {
		display: inline-block;
		margin-left: 0.6em;
	}

	.list-element {
		padding: 1ex 0.4ex 0.8ex 0.4ex;
		margin-bottom: 0.8ex;
	}

	.list-element:hover {
		background-color: #daebf7;
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

	.centered {
		display: flex;
		justify-content: center;

		margin: 0 1ex 0 1ex;
		padding: 0.2ex;
	}

	.centered button {
		font-size: 14px;
		display: inline-block;
		padding: 0.35em 1.2em;
		margin: 0 0.3em 0.3em 0;
		text-align: center;
		transition: all 0.5s;
	}

	.textarea-label {
		display: inline-block;
		text-align: right;
		box-sizing: border-box;
		width: 100%;
		margin: 0;
		padding-right: 1.1em;
		font-size: 10px;
		color: #888;
	}
	.centered textarea {
		width: 100%;
		display: inline-block;
		height: auto;
		padding: 0.35em 0.6em;
		margin: 0 0 0.66em 0;

		font-family: Inter, sans-serif;
		font-feature-settings: "liga", "calt";
		font-size: 12px;
		font-weight: 400;
		font-stretch: 100%;
	}
</style>
