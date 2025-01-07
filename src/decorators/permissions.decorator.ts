import { SetMetadata } from '@nestjs/common';
import { Action } from 'src/permission/enums/action.enum';
import { Resource } from 'src/permission/enums/resource.enum';

export const PERMISSION_KEY = 'permissions';

export type Permissions = {
  resource: Resource;
  actions: Action[];
};

export const Permissions = (permissions: Permissions[]) =>
  SetMetadata(PERMISSION_KEY, permissions);
