import { AppDataSource } from '../dataSource.js';
import { Game } from '../entities/Game.js';

const GameRepository = AppDataSource.getRepository(Game);

async function addGame(name: string, price: number): Promise<Game>{
  const newGame = new Game();
  newGame.name = name;
  newGame.price = price;

  console.log('new game created. ID: ', newGame.gameId);
  return GameRepository.save(newGame);
}

async function getGameById(gameId: string): Promise<Game | null>{
  return GameRepository.findOne({ where: {gameId} });
}

async function getAllGames(): Promise<Game[]> {
  return GameRepository.find();
}

export { addGame, getAllGames, getGameById };
