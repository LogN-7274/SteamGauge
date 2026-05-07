import { z } from 'zod';
import { gameType } from '../entities/Game.js';

export const LogGamesSchema = z.array(z.object({
  id: z.string(),
  title: z.string().min(1),
}));
export type LogGamesRequest = z.infer<typeof LogGamesSchema>;

export const LogPricesSchema = z.array(z.object({
  amount: z.number()
}))
export type LogPricesRequest = z.infer<typeof LogPricesSchema>;

export const GetGameSchema = z.object({
  gameId: z.string(),
});
export type GetGameParams = z.infer<typeof GetGameSchema>;

export const GetAllGamesSchema = z.object({
  type: z.enum(gameType).optional(),
});
export type GetAllGamesParams = z.infer<typeof GetAllGamesSchema>;
