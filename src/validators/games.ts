import { z } from 'zod';
import { gameType } from '../entities/Game';

export const CreateGameSchema = z.object({
  name: z.string().min(1, "Input name of game"),
  price: z.string().transform(Number),
  type: z.enum(gameType)
});

export const GetGameSchema = z.object({
  gameId: z.string()
})

export const getAllGamesSchema = z.object({
  type: z.enum(gameType).optional()
})