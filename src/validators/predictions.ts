import { z } from 'zod';

export const CreatePredictionParamsSchema = z.object({
  gameId: z.string()
})

export const CreatePredictionBodySchema = z.object({
  predictionPrice: z.string().transform(Number),
  predictionDate: z.string()
})

export const GetPredictionSchema = z.object({
  gameId: z.string()
})