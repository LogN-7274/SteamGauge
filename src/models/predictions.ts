import { AppDataSource } from "../dataSource.js";
import { Prediction } from "../entities/Prediction.js";

const PredictionRepository = AppDataSource.getRepository(Prediction);

async function addPrediction(gameId: string, 
                             predictionPrice: number, 
                             predictionDate: string): Promise<Prediction> {

  const newPrediction = new Prediction();
  newPrediction.gameId = gameId;
  newPrediction.predictionPrice = predictionPrice;
  newPrediction.predictionDate = predictionDate;

  console.log('new prediction added');
  return PredictionRepository.save(newPrediction);
}

async function getPredictionByGameId(gameId: string): Promise<Prediction> {
  return PredictionRepository.findOne({ where: {gameId} })
}

export { addPrediction, getPredictionByGameId };
