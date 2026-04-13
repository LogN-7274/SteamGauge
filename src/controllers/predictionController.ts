import { Request, Response } from 'express';
import { addPrediction, getPredictionByGameId } from '../models/predictions.js';
import { parseDatabaseError } from '../utils/db-utils.js';
import {
  CreatePredictionBodySchema,
  CreatePredictionParamsSchema,
  GetPredictionSchema,
} from '../validators/predictions.js';
async function createPrediction(req: Request, res: Response): Promise<void> {
  const paramsResult = CreatePredictionParamsSchema.safeParse(req.params);
  const bodyResult = CreatePredictionBodySchema.safeParse(req.body);
  if (!bodyResult.success || !paramsResult.success) {
    res.status(400);
    return;
  }

  const { gameId } = paramsResult.data;
  const { predictionPrice, predictionDate } = bodyResult.data;

  try {
    const newPrediction = await addPrediction(gameId, predictionPrice, predictionDate);
    console.log(newPrediction);
    res.sendStatus(201);
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err);
    res.status(500).json(databaseErrorMessage);
  }
}

async function displayPrediction(req: Request, res: Response): Promise<void> {
  const result = GetPredictionSchema.safeParse(req.params);
  if (!result.success) {
    res.status(400).json(result.error.flatten());
    return;
  }

  const { gameId } = result.data;

  const prediction = await getPredictionByGameId(gameId);
  if (!prediction) {
    console.log('Could not find prediction');
    res.status(404).json({ message: 'Prediction Not Found' });
    return;
  }

  console.log('Successfully retrieved prediction');
  res.status(200).json(prediction);
  return;
}

export { createPrediction, displayPrediction };
