<script lang="ts">
  import { auth } from '$lib/auth.svelte';
  import { toast } from '$lib/toast.svelte';
</script>

<h1>Welcome to Steam Guage</h1>

{#if auth.loading}
  <p aria-busy="true">Checking session…</p>
{:else if auth.user}
  <h1>Welcome back, {auth.user.displayName}</h1>
  <p>What would you like to do?</p>
  <a href="/games" role="button">Check Games</a>
{:else}
  <p>Relieve some pressure, see if your favorite games are likely to go on sale.</p>
  <a href="/register" role="button">Get Started</a>
  <a href="/login" role="button">I already have an account</a>
{/if}