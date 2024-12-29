import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Resource } from '../enums/resource.enum';
import { Action } from '../enums/action.enum';
import { Role } from 'src/roles/entities/role.entity';

@Entity()
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  resource: Resource;

  @Column()
  action: Action;

  @ManyToMany(() => Role, (role) => role.permissions)
  roles: Role[];

  constructor(partial: Partial<Permission>) {
    Object.assign(this, partial);
  }
}
