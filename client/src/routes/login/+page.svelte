<script lang="ts">
  import { goto } from '$app/navigation';
  import { api } from '$lib/api';
  import { auth } from '$lib/auth.svelte';
  import { toast } from '$lib/toast.svelte';

  let email = $state('');
  let passToHash = $state('');
  let submitting = $state(false);

  async function handleSubmit(event: Event): Promise<void> {
    event.preventDefault();
    submitting = true;

    const result = await api.post('/login', { email, passToHash });

    submitting = false;

    console.log(result.status);
    console.log(result.data);

    if (result.status === 403) {
      toast.error('Invalid email or password');
      return;
    }

    if (!result.ok) {
      toast.error('Something went wrong');
      return;
    }

    await auth.refresh();
    goto('/games');
  }
</script>

<h1>Log In</h1>

<form onsubmit={handleSubmit}>
  <label>
    Email
    <input type="email" bind:value={email} required />
  </label>

  <label>
    Password
    <input type="password" bind:value={passToHash} required />
  </label>

  <button type="submit" disabled={submitting}>
    {submitting ? 'Logging in...' : 'Log In'}
  </button>
</form>

<p>Don't have an account? <a href="/register">Register</a></p>
