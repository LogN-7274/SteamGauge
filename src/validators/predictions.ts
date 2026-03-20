import { z } from 'zod';

export const CreatePredictionParamsSchema = z.object({
  gameId: z.string()
})
export type CreatePredictionParams = z.infer<typeof CreatePredictionParamsSchema>

export const CreatePredictionBodySchema = z.object({
  predictionPrice: z.string().transform(Number),
  predictionDate: z.string()
})
export type CreatePredictionBody = z.infer<typeof CreatePredictionBodySchema>

export const GetPredictionSchema = z.object({
  gameId: z.string()
})
export type GetPredictionParams = z.infer<typeof GetPredictionSchema>