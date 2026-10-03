<script lang="ts">
	import { format } from 'svelte-i18n';

	let { key }: { key: string } = $props();
	let text = $state(key);

	$effect(() => {
		const unsubscribe = format.subscribe((formatter) => {
			text = formatter(key);
		});
		return unsubscribe;
	});
</script>

{text}
