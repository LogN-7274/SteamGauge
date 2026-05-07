import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  Relation,
} from 'typeorm';
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

  @Column()
  title: string;

  @Column({type: 'decimal', scale: 2})
  price: number;

  @Column({nullable: true})
  boxart: string;

  @OneToMany(() => SaleHistory, (history) => history.game)
  saleHistory: Relation<SaleHistory[]>;

  @OneToOne(() => Prediction, (prediction) => prediction.game)
  prediction: Relation<Prediction>;
}
