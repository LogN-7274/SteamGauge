import { z } from 'zod';

export const CreateGameSchema = z.object({
  name: z.string().min(1, "Input name of game"),
  price: z.string().transform(Number),
});

export const GetGameSchema = z.object({
  gameId: z.string()
})