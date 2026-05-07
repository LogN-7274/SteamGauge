<script lang="ts">
  import { auth } from '$lib/auth.svelte';
  import { toast } from '$lib/toast.svelte';

  let userId = $state('');

  function grabId(): void{ //I don't know why but the html is weird if I don't
    if (auth.user){        //do this
      userId = auth.user.id;
    }
  }
</script>

<h1>Welcome to Steam Guage</h1>

{#if auth.loading}
  <p aria-busy="true">Checking session…</p>
{:else if auth.user}
  {grabId()}
  <h1>Welcome back, {auth.user.displayName}</h1>
  <p>What would you like to do?</p>
  <a href="/games" role="button">Check Games</a>
  <a href="/users/{userId}" role="button">Home</a>
{:else}
  <p>Relieve some pressure, see if your favorite games are likely to go on sale.</p>
  <a href="/register" role="button">Get Started</a>
  <a href="/login" role="button">I already have an account</a>
{/if}