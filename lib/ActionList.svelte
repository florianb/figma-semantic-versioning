<script>
	import { debounce } from "lodash";

	export let actions = [];

	let selection = "keep";
	let commitMessage = null;
	let settings = null;

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
	};

	function currentVersionFor(label) {
		const currentAction = actions.find((a) => a.label === label);

		if (label === "toName") {
			return currentAction.nameVersion;
		} else {
			const action = actions.find((a) => a.label === "keep");

			return action.version || "not versioned";
		}
	}

	function isCommitMessageDisabled(selection) {
		return selection === "keep";
	}

	function useCommitMessage() {
		return settings && settings.useCommitMessage;
	}

	function saveAction(selection, actions) {
		const action = actions.find((a) => a.label === selection);

		console.log(selection, actions, action);

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
		parent.postMessage(
			{
				pluginMessage: {
					type: "updateCommitMessage",
					commitMessage,
				},
			},
			"*"
		);
	}, 300);

	$: (commitMessageRemainingCharacters) =>
		commitMessageMaxLength - (commitMessage ? commitMessage.length : 0);
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
	<div class="centered">
		<label for="commit-message">{commitMessageRemainingCharacters}</label>
		<textarea
			id="commit-message"
			bind:value={commitMessage}
			disabled={isCommitMessageDisabled(selection)}
			on:input={updateCommitMessage()}
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

	.centered textarea {
		width: 100%;
		height: auto;
		padding: 0.35em 0.6em;
		margin: 0 0.66em 0.66em 0;
	}
</style>
