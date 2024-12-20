import { Column, Entity } from 'typeorm';

@Entity()
export class ResetToken {
  @Column({ primary: true })
  userId: number;

  @Column()
  token: string;

  @Column()
  expiryDate: Date;

  constructor(partial: Partial<ResetToken>) {
    Object.assign(this, partial);
  }
}
