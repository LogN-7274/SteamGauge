import { ILike } from 'typeorm';
import { AppDataSource } from '../dataSource.js';
import { Game } from '../entities/Game.js';

const GameRepository = AppDataSource.getRepository(Game);

async function addGame(id: string, title: string, price: number, boxart: string): Promise<Game>{
  const newGame = new Game();
  newGame.gameId = id;
  newGame.title = title;
  newGame.price = price;
  newGame.boxart = boxart;
  return GameRepository.save(newGame);
}

async function getGameById(gameId: string): Promise<Game | null> {
  return GameRepository.findOne({ where: { gameId } });
}

async function getAllGames(): Promise<Game[]> {
  return GameRepository.find();
}

async function searchGames(q: string): Promise<Game[]> {
  return GameRepository.find( {where: { title: ILike(`%${q}%`)}} )
}

export { addGame, getAllGames, getGameById, searchGames };

