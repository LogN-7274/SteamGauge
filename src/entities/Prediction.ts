import { BeforeInsert, Column, Entity, JoinColumn, OneToOne, PrimaryColumn, Relation } from 'typeorm';
import { v7 as uuidv7 } from 'uuid';
import { Game } from './Game.js';

@Entity()
export class Prediction {
  @PrimaryColumn()
  predictionId: string;

  @BeforeInsert()
  generateId() : void{
    this.predictionId = uuidv7();
  }

  @Column()
  predictionPrice: number;

  @Column()
  predictionDate: Date; //change to a date later

  // @CreateDateColumn()
  // predictedAt: string; //change to a date later

  @OneToOne(() => Game, (game) => game.prediction)
  @JoinColumn({ name: 'gameId' })
  game: Relation<Game>;
}
