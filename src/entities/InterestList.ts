import { Entity, PrimaryColumn, ManyToMany, JoinTable } from 'typeorm';
import { WishList } from './WishList';

@Entity()
export class InterestList {
  @PrimaryColumn()
  userId: string;

  @ManyToMany(() => WishList)
  @JoinTable()
  wishLists: WishList[];
}
