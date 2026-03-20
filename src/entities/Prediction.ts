import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn, Relation } from 'typeorm';
import { Game } from './Game.js';

@Entity()
export class Prediction {
  @PrimaryColumn()
  gameId: string;

  @Column()
  predictionPrice: number;

  @Column()
  predictionDate: string; //change to a date later

  @Column()
  predictedAt: string; //change to a date later

  @OneToOne(() => Game, (game) => game.prediction)
    @JoinColumn({ name: 'gameId' })
    game: Relation<Game>;
}