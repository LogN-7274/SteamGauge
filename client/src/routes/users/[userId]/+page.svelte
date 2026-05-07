<script lang="ts">
  import { goto } from '$app/navigation';
  import { auth } from '$lib/auth.svelte';
  import { page } from '$app/state';
  import { onMount } from 'svelte';
  import { api } from '$lib/api';
  import { toast } from '$lib/toast.svelte';

  const userId = page.params.userId;

  let userWishSearch = $state('');
  let submitting = $state(false);

  onMount(() => {
    if (!auth.user) {
      goto('/');
    }
});

async function handleSubmit(event: Event): Promise<void> {
    event.preventDefault();
    submitting = true;

    const result = await api.get(`/users/${userWishSearch}/wishlist`);

    submitting = false;

    if (!result.ok) {
      toast.error('Wishlist search failed.');
      return;
    }

    toast.success('Taking you to their wishlist');
    goto(`/users/${userWishSearch}/wishlist`);
  }
</script>

{#if auth.loading}
  <p aria-busy="true">Checking session…</p>
{:else if auth.user}
  <h1>Where would you like to go, {auth.user.displayName} ?</h1>
  <a href="/games" role="button">Check Games</a>
  <a href="/users/{userId}/wishlist/self" role="button">My Wishlist</a>
  <a href="/users/{userId}/interest" role="button">My Interest List</a>
  <a href="/users/{userId}/notification" role="button">Likely Sale Notifications</a>

  <form onsubmit={handleSubmit}>
  <label>
    View someone's wishlist! Paste the ID they sent you:
    <input type="text" bind:value={userWishSearch} required />
  </label>
  <button type="submit" disabled={submitting}>
    {submitting ? 'Searching...' : 'View Wishlist'}
  </button>
</form>
{:else}
  <p>Please log in</p>
  <a href="/login" role="button">Log in</a>
{/if}