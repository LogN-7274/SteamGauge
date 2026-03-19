import { Entity, JoinTable, ManyToMany, PrimaryColumn, Relation } from 'typeorm';
import { Game } from './Game.js';

@Entity()
export class WishList {
  @PrimaryColumn()
  userId: string;

  @ManyToMany(() => Game)
  @JoinTable()
  games: Relation<Game[]>;
}
