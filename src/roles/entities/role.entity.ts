import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Resource } from '../enums/resource.enum';
import { Action } from '../enums/action.enum';

class Permission {
  @Column()
  resource: Resource;

  @Column('simple-array')
  actions: Action[];
}

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column(() => Permission)
  permissions: Permission[];

  constructor(partial: Partial<Role>) {
    Object.assign(this, partial);
  }
}
