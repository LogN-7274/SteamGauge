import {
  BeforeInsert,
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  Relation,
} from 'typeorm';
import { v7 as uuidv7 } from 'uuid';
import { Prediction } from './Prediction.js';
import { SaleHistory } from './SaleHistory.js';

export enum gameType {
  FPS = 'fps',
  RPG = 'rpg',
  INDIE = 'indie',
}

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

  @Column({ type: 'enum' })
  type: gameType;

  @OneToMany(() => SaleHistory, (history) => history.game)
  gameHistory: Relation<SaleHistory[]>;

  @OneToOne(() => Prediction, (prediction) => prediction.game)
  prediction: Relation<Prediction>;
}
