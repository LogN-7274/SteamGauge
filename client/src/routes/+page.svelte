<script lang="ts">
  import { auth } from '$lib/auth.svelte';
  import { onMount } from 'svelte';

  let userId = $state('');

  // function grabId(): void{ //I don't know why but the html is weird if I don't
  //   if (auth.user){        //do this
  //     userId = auth.user.id;
  //   }
  // }

  onMount(async () => {
    // This page wasn't working for me so hopefully
    await auth.refresh(); // this still works for you
  });
</script>

<h1>Welcome to Steam Gauge</h1>

{#if auth.loading}
  <p aria-busy="true">Checking session…</p>
{:else if auth.user}
  <h1>Welcome back, {auth.user.displayName}</h1>
  <p>What would you like to do?</p>
  <a href="/games" role="button">Check Games</a>
  <a href="/users/{auth.user.id}" role="button">Home</a>
{:else}
  <p>Relieve some pressure, see if your favorite games are likely to go on sale.</p>
  <a href="/register" role="button">Get Started</a>
  <a href="/login" role="button">I already have an account</a>
{/if}
