import { BeforeInsert, Entity, OneToMany, PrimaryColumn, Relation } from 'typeorm';
import { v7 as uuidv7 } from 'uuid';
import { SaleHistory } from './SaleHistory.js';


@Entity()
export class Game {
  @PrimaryColumn()
  gameId: string;

  @BeforeInsert()
  generateId(): void {
    this.gameId = uuidv7();
  }

  @OneToMany(() => SaleHistory, (history) => history.game)
  gameHistory: Relation<SaleHistory[]>;
}
