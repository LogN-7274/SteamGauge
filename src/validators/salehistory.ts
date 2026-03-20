import { z } from 'zod';

export const CreateSaleHistoryParamsSchema = z.object({
  gameId: z.string()
})
export type CreateSaleHistoryParams = z.infer<typeof CreateSaleHistoryParamsSchema>

export const CreateSaleHistoryBodySchema = z.object({
  price: z.array(z.string().transform(Number)),
  priceDate: z.array(z.string())
})
export type CreateSaleHistoryBody = z.infer<typeof CreateSaleHistoryBodySchema>

export const GetSaleHistorySchema = z.object({
  gameId: z.string()
})
export type GetSaleHistoryParams = z.infer<typeof GetSaleHistorySchema>