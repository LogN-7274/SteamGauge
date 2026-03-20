import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, Relation } from 'typeorm';
import { Game } from './Game.js';

@Entity()
export class SaleHistory {
  @PrimaryColumn()
  gameId: string;

  @Column("simple-array") // typeORM documentation https://typeorm.io/docs/entity/entities/
  priceDate: string[]; //need to change to date later

  @Column("simple-array")
  price: number[];

  @ManyToOne(() => Game, (game) => game.gameHistory)
  @JoinColumn({ name: 'gameId' })
  game: Relation<Game>;
}
