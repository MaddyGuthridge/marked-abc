<script lang="ts">
  import { Marked } from 'marked';
  import markedAbc from "marked-abc";
  import { onMount } from 'svelte';
  import source from './example.md?raw';

  let markdownRender: HTMLDivElement | undefined = $state();

  const abc = markedAbc();

  const marked = new Marked();
  marked.use(abc.extension);

  onMount(() => abc.forceRenderAll());
</script>

{@html marked.parse(source)}
