import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Game } from './Game';

@Entity()
export class SaleHistory {
  @PrimaryColumn()
  gameId: string;

  @Column()
  priceDate: string; //need to change to a date later

  @Column()
  price: number;

  @ManyToOne(() => Game, (game) => game.gameHistory)
  @JoinColumn({ name: 'gameId' })
  game: Game;
}
