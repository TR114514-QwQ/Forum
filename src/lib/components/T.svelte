<script lang="ts">
	import { get } from 'svelte/store';
	import { format } from 'svelte-i18n';

	let { key }: { key: string } = $props();
	let text = $derived(get(format)(key));
</script>

{text}
