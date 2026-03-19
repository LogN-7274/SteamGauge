import { AppDataSource } from '../dataSource.js';
import { Game } from '../entities/Game.js';

const GameRepository = AppDataSource.getRepository(Game);

async function getGameById(gameId: string): Promise<Game | null>{
  return GameRepository.findOne({ where: {gameId} });
}

async function getAllGames(): Promise<Game[]> {
  return GameRepository.find();
}

export { getAllGames, getGameById };
