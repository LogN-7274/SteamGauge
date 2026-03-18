import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { v7 as uuidv7 } from 'uuid';
import { Game } from './Game';

@Entity()
export class SaleHistory {
  @PrimaryColumn()
  saleId: string;

  @BeforeInsert()
  generateId(): void {
    this.saleId = uuidv7();
  }

  @Column()
  priceDate: string; //need to change to a date later

  @Column()
  gameId: string;

  @ManyToOne(() => Game, (game) => game.gameHistory)
  @JoinColumn({ name: 'gameId' })
  game: Game;
}
