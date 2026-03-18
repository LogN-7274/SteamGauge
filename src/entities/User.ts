import { BeforeInsert, Column, Entity, PrimaryColumn } from 'typeorm';
import { v7 as uuidv7 } from 'uuid';

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
}
