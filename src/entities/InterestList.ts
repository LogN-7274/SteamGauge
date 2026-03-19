import { Entity, JoinTable, ManyToMany, PrimaryColumn, Relation } from 'typeorm';
import { WishList } from './WishList.js';

@Entity()
export class InterestList {
  @PrimaryColumn()
  userId: string;

  @ManyToMany(() => WishList)
  @JoinTable()
  wishLists: Relation<WishList[]>;
}
