import { z } from 'zod';

export const registerUserSchema = z.object({
  userName: z.string().min(1, 'Name is required').max(20, 'Name must be 20 characters or less'),
  passToHash: z.string().min(8, 'Password must be 8 characters or more.'),
  email: z.string(), //need to figure out what else to add to this, later.
});

export const getUserIdSchema = z.object({
  userId: z.string(),
});
