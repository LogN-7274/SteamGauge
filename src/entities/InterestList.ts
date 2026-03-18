import { Entity, PrimaryColumn, BeforeInsert } from 'typeorm';
import { v7 as uuidv7 } from 'uuid';

@Entity()
export class InterestList {
  @PrimaryColumn()
  interestId: string;

  @BeforeInsert()
  generateId(): void {
    this.interestId = uuidv7();
  }

  // @ManyToMany(() => WishList)
  //   @JoinTable()
  //   wishLists: WishList[];  NOTE: not finished yet.
}
