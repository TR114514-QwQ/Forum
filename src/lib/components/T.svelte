<script lang="ts">
	import { format } from 'svelte-i18n';

	let { key, values }: { key: string; values?: Record<string, string | number> } = $props();
	let text = $state(key);

	$effect(() => {
		const unsubscribe = format.subscribe((formatter) => {
			text = formatter(key, values ? { values } : undefined);
		});
		return unsubscribe;
	});
</script>

{text}
