{#if useRfc !== null}
<input
	type="checkbox"
	id="use-rfc"
	bind:checked={useRfc}
	on:change={updateRfc(useRfc)}
>
<label for="use-rfc">Use "requests for comments"</label>
{/if}

{#if updateName !== null}
<input
	type="checkbox"
	id="update-name"
	bind:checked={updateName}
	on:change={updateName(updateName)}
>
<label for="updateName">Add version to name</label>
{/if}

<script>
	export let useRfc = null;
	export let updateName = null;

	function updateRfc(useRfc) {
		parent.postMessage({
			pluginMessage: {
				type: 'updateSettings',
				settings: {
					useRfc,
					updateName
				}
			}
		}, '*');
	}
</script>
