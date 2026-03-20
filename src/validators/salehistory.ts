import { z } from 'zod';

export const CreateSaleHistoryParamsSchema = z.object({
  gameId: z.string()
})

export const CreateSaleHistoryBodySchema = z.object({
  price: z.array(z.string().transform(Number)),
  priceDate: z.array(z.string())
})

export const GetSaleHistorySchema = z.object({
  gameId: z.string()
})