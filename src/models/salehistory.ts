import { AppDataSource } from '../dataSource.js';
import { SaleHistory } from '../entities/SaleHistory.js';

const SaleHistoryRepository = AppDataSource.getRepository(SaleHistory);

async function addSaleHistory(
  gameId: string,
  price: number[],
  priceDate: string[],
): Promise<SaleHistory> {
  const newSaleHistory = new SaleHistory();
  newSaleHistory.gameId = gameId;
  newSaleHistory.price = price;
  newSaleHistory.priceDate = priceDate;

  console.log('new Sale History added');
  return SaleHistoryRepository.save(newSaleHistory);
}

async function getSaleHistoryByGameId(gameId: string): Promise<SaleHistory> {
  return SaleHistoryRepository.findOne({ where: { gameId } });
}

export { addSaleHistory, getSaleHistoryByGameId };
