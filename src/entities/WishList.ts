import {
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToOne,
  PrimaryColumn,
  Relation,
} from 'typeorm';
import { Game } from './Game.js';
import { User } from './User.js';

@Entity()
export class WishList {
  @PrimaryColumn()
  userId: string;

  @ManyToMany(() => Game)
  @JoinTable()
  games: Relation<Game>[];

  @OneToOne(() => User)
  @JoinColumn()
  user: Relation<User>;
}
