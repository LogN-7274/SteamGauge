import { Entity, PrimaryColumn, BeforeInsert, OneToMany } from 'typeorm';
import { v7 as uuidv7 } from 'uuid';
import { SaleHistory } from './SaleHistory';

@Entity()
export class Game {
  @PrimaryColumn()
  gameId: string;

  @BeforeInsert()
  generateId(): void {
    this.gameId = uuidv7();
  }

  @OneToMany(() => SaleHistory, (history) => history.game)
  gameHistory: SaleHistory[];
}
