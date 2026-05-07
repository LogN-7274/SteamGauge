import { AppDataSource } from "../dataSource.js";
import { Game } from "../entities/Game.js";
import { SaleHistory } from "../entities/SaleHistory.js";

const SaleHistoryRepository = AppDataSource.getRepository(SaleHistory);

async function addSaleHistory(deal: number, 
                              dealDate: Date,
                              cut: number,
                              gameId: string): Promise<SaleHistory> {
  const newSaleHistory = new SaleHistory();

  newSaleHistory.deal = deal;
  newSaleHistory.dealDate = dealDate;
  newSaleHistory.cut = cut;
  newSaleHistory.game = { gameId: gameId } as Game;

  console.log('new Sale History added');
  return SaleHistoryRepository.save(newSaleHistory);
}

async function getSaleHistoryByGameId(gameId: string): Promise<SaleHistory[]> {
  return SaleHistoryRepository.find({ where: { game: { gameId: gameId } }, relations: ['game'],
                                      order:{ dealDate: "ASC"} })
}

export { addSaleHistory, getSaleHistoryByGameId };

