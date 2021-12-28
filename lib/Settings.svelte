{#if useRfc !== null}
<input
	type="checkbox"
	id="use-rfc"
	bind:checked={useRfc}
	on:change={updateRfc(useRfc)}
>
<label for="use-rfc">Use "requests for comments"</label>
{/if}


<script>
	export let useRfc = null;

	function updateRfc(useRfc) {
		parent.postMessage({
			pluginMessage: {
					type: 'updateSettings',
					settings: {
						useRfc
				}
			}
		}, '*');
	}
</script>
