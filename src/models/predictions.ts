import { AppDataSource } from '../dataSource.js';
import { Game } from '../entities/Game.js';
import { Prediction } from '../entities/Prediction.js';

const PredictionRepository = AppDataSource.getRepository(Prediction);

async function addPrediction(
  predictionPrice: number,
  predictionDate: Date,
  gameId: string
): Promise<Prediction> {
  const newPrediction = new Prediction();
  newPrediction.predictionPrice = predictionPrice;
  newPrediction.predictionDate = predictionDate;

  newPrediction.game = { gameId: gameId} as Game;

  console.log('new prediction added');
  return PredictionRepository.save(newPrediction);
}

async function getPredictionByGameId(gameId: string): Promise<Prediction> {
  return PredictionRepository.findOne({ where: { game: { gameId: gameId} } });
}

export { addPrediction, getPredictionByGameId };

