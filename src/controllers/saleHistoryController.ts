import { Request, Response } from 'express';
import { addSaleHistory, getSaleHistoryByGameId } from '../models/salehistory';
import { parseDatabaseError } from '../utils/db-utils';
import { CreateSaleHistoryBodySchema, CreateSaleHistoryParamsSchema, GetSaleHistorySchema } from '../validators/salehistory';

async function createSaleHistory(req: Request, res: Response): Promise<void> {
  const paramsResult = CreateSaleHistoryParamsSchema.safeParse(req.params);
  const bodyResult = CreateSaleHistoryBodySchema.safeParse(req.body);
  if (!bodyResult.success || !paramsResult.success) {
    res.status(400);
    return;
  }

  const { gameId } = paramsResult.data;
  const { price, priceDate } = bodyResult.data;

  try{
    const newSaleHistory = await addSaleHistory(gameId, price, priceDate);
    console.log(newSaleHistory);
    res.sendStatus(201);
  } catch(err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err);
    res.status(500).json(databaseErrorMessage);
  }
}

async function displaySaleHistory(req: Request, res: Response): Promise<void> {
  const result = GetSaleHistorySchema.safeParse(req.params);
  if (!result.success) {
    res.status(400).json(result.error.flatten());
    return;
  }

  const { gameId } = result.data;

  const saleHistory = await getSaleHistoryByGameId(gameId);
  if(!saleHistory){
    console.log("Could not find sale history");
    res.status(404).json({message: 'Sale history Not Found'});
    return;
  }

  console.log('Successfully retrieved sale history');
  res.status(200).json(saleHistory);
  return;
}

export { createSaleHistory, displaySaleHistory };
