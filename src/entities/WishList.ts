import { Entity, PrimaryColumn, ManyToMany, JoinTable } from 'typeorm';
import { Game } from './Game';

@Entity()
export class WishList {
  @PrimaryColumn()
  userId: string;

  @ManyToMany(() => Game)
  @JoinTable()
  games: Game[];
}
