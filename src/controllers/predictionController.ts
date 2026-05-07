import { spawn } from 'child_process';
import { Request, Response } from 'express';
import { getAllGames } from '../models/games.js';
import { addPrediction, getPredictionByGameId } from '../models/predictions.js';
import {
  GetPredictionSchema,
} from '../validators/predictions.js';

// async function createPrediction(req: Request, res: Response): Promise<void> {
//   const paramsResult = CreatePredictionParamsSchema.safeParse(req.params);
//   const bodyResult = CreatePredictionBodySchema.safeParse(req.body);
//   if (!bodyResult.success || !paramsResult.success) {
//     res.status(400);
//     return;
//   }

//   const { gameId } = paramsResult.data;
//   const { predictionPrice, predictionDate } = bodyResult.data;

//   try {
//     const newPrediction = await addPrediction(predictionPrice, predictionDate, gameId);
//     console.log(newPrediction);
//     res.sendStatus(201);
//   } catch (err) {
//     console.error(err);
//     const databaseErrorMessage = parseDatabaseError(err);
//     res.status(500).json(databaseErrorMessage);
//   }
// }

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

async function calculatePredictions(res: Response, req: Request): Promise<void>{
  const games = await getAllGames();
  for(const game of games){
    await new Promise<void>((resolve) => {
      const python = spawn('python', ['-u', './src/prediction.py', game.gameId])
      let resultData = "";

      python.stdout.on('data', (data) => {
        resultData += data.toString();
      });
      python.stderr.on('data', (data) => {
        console.error(`PYTHON ERROR: ${data.toString()}`);
      })

      python.on('close', async (code) => {
        console.log(code);
        if(code === 0 && resultData){
          console.log("Somethign");
          try {
            const result = JSON.parse(resultData);
            const parsedDate = new Date(result.predictionDate);
            if(!isNaN(parsedDate.getTime())){
              await addPrediction(result.predictionPrice, parsedDate, 
                                  game.gameId);
            }
          } catch(err){
            console.error(err);
          }
        }
        resolve();
      })
    })
  }
}

export { calculatePredictions, displayPrediction };

