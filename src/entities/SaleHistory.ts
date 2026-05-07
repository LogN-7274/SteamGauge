import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, Relation } from 'typeorm';
import { v7 as uuidv7 } from 'uuid';
import { Game } from './Game.js';

@Entity()
export class SaleHistory {
  @PrimaryColumn()
  salesHistoryId: string;

  @BeforeInsert()
  generateId(): void{
    this.salesHistoryId = uuidv7();
  }

  @Column() 
  dealDate: Date; 

  @Column({type: 'decimal', scale: 2})
  deal: number;

  @Column()
  cut: number;

  @ManyToOne(() => Game, (game) => game.saleHistory)
  @JoinColumn({ name: 'gameId' })
  game: Relation<Game>;
}
