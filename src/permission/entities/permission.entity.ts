import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Resource } from '../enums/resource.enum';
import { Action } from '../enums/action.enum';

@Entity()
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  resource: Resource;

  @Column()
  action: Action;

  constructor(partial: Partial<Permission>) {
    Object.assign(this, partial);
  }
}
