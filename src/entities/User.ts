import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  Relation,
} from 'typeorm';
import { v7 as uuidv7 } from 'uuid';
import { InterestList } from './InterestList.js';
import { WishList } from './WishList.js';

@Entity()
export class User {
  @PrimaryColumn()
  userId: string;

  @BeforeInsert()
  generateId(): void {
    this.userId = uuidv7();
  }

  @Column({ unique: true })
  email: string;

  @Column()
  passHash: string;

  @Column()
  userName: string;

  //need onetoone with wishlist, one to one with interest list
  @OneToOne(() => WishList)
  @JoinColumn()
  wishlist: Relation<WishList>;

  @OneToOne(() => InterestList)
  @JoinColumn()
  interestList: Relation<InterestList>;
}
