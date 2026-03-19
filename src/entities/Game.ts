import { BeforeInsert, Column, Entity, OneToMany, OneToOne, PrimaryColumn, Relation } from 'typeorm';
import { v7 as uuidv7 } from 'uuid';
import { Prediction } from './Prediction.js';
import { SaleHistory } from './SaleHistory.js';


@Entity()
export class Game {
  @PrimaryColumn()
  gameId: string;

  @BeforeInsert()
  generateId(): void {
    this.gameId = uuidv7();
  }

  @Column()
  name: string;

  @Column()
  price: number;

  @OneToMany(() => SaleHistory, (history) => history.game)
  gameHistory: Relation<SaleHistory[]>;

  @OneToOne(() => Prediction, (prediction) => prediction.game)
  prediction: Relation<Prediction>;
}
