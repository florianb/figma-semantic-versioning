<h3>Settings (per Document)</h3>

{#if useRfc !== null}
<input
	type="checkbox"
	id="use-rfc"
	bind:checked={useRfc}
	on:change={setUseRfc(useRfc)}
>
<label for="use-rfc">Use "requests for comments"</label>
{/if}

{#if updateName !== null}
<input
	type="checkbox"
	id="update-name"
	bind:checked={updateName}
	on:change={setUpdateName(updateName)}
>
<label for="update-name">Use version postfix (f.e. "@1.0.0") at Node names</label>
{/if}

<script>
	export let useRfc = null;
	export let updateName = null;

	function setUseRfc(useRfc) {
		parent.postMessage({
			pluginMessage: {
				type: 'updateSettings',
				settings: {
					useRfc,
				}
			}
		}, '*');
	}

	function setUpdateName(updateName) {
		parent.postMessage({
			pluginMessage: {
				type: 'updateSettings',
				settings: {
					updateName,
				}
			}
		}, '*');
	}
</script>

<style></style>
