import { AppDataSource } from '../dataSource.js';
import { Game, gameType } from '../entities/Game.js';

const GameRepository = AppDataSource.getRepository(Game);

async function addGame(name: string, price: number, type: gameType): Promise<Game>{
  const newGame = new Game();
  newGame.name = name;
  newGame.price = price;
  newGame.type = type;

  console.log('new game created. ID: ', newGame.gameId);
  return GameRepository.save(newGame);
}

async function getGameById(gameId: string): Promise<Game | null>{
  return GameRepository.findOne({ where: { gameId } });
}

async function getAllGames(type?: gameType): Promise<Game[]> {
  if(!type){
    return GameRepository.find();
  }
  return GameRepository.find({ where: { type } });
}

export { addGame, getAllGames, getGameById };
