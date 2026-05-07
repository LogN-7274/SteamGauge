<script lang="ts">
  import { goto } from '$app/navigation';
  import { api } from '$lib/api';
  import { toast } from '$lib/toast.svelte';

  let email = $state('');
  let passToHash = $state('');
  let userName = $state('');
  let displayName = $state('');
  let submitting = $state(false);

  async function handleSubmit(event: Event): Promise<void> {
    event.preventDefault();
    submitting = true;

    const result = await api.post('/users', { userName, passToHash, email, displayName });

    submitting = false;

    if (!result.ok) {
      toast.error('Registration failed.');
      return;
    }

    toast.success('Account created! Please log in.');
    goto('/login');
  }
</script>


<h1>Register</h1>

<form onsubmit={handleSubmit}>
  <label>
    Email
    <input type="email" bind:value={email} required />
  </label>

  <label>
    Password
    <input type="password" bind:value={passToHash} required />
  </label>

  <label>
    Username
    <input type="userName" bind:value={userName} required />
  </label>

  <label>
    Display Name 
    <input type="displayName" bind:value={displayName} required />
  </label>

  <button type="submit" disabled={submitting}>
    {submitting ? 'Creating account...' : 'Register'}
  </button>
</form>
