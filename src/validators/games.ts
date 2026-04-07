import { z } from 'zod';
import { gameType } from '../entities/Game.js';

export const CreateGameSchema = z.object({
  name: z.string().min(1, 'Input name of game'),
  price: z.string().transform(Number),
  type: z.enum(gameType),
});
export type CreateGameBody = z.infer<typeof CreateGameSchema>;

export const GetGameSchema = z.object({
  gameId: z.string(),
});
export type GetGameParams = z.infer<typeof GetGameSchema>;

export const getAllGamesSchema = z.object({
  type: z.enum(gameType).optional(),
});
export type GetAllGamesParams = z.infer<typeof getAllGamesSchema>;
