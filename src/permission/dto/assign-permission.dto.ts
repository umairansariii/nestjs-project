import { ArrayNotEmpty, ArrayUnique, IsDefined, IsInt } from 'class-validator';

export class AssignPermissionDto {
  @IsInt({ message: 'Role identity must be an integer' })
  @IsDefined({ message: 'Role identity is required' })
  roleId: number;

  @ArrayUnique({ message: 'Permission identities must be unique' })
  @IsInt({
    each: true,
    message: 'Permission identities must be integers',
  })
  @ArrayNotEmpty({ message: 'Permission identities should not empty' })
  @IsDefined({ message: 'Permission identities are required' })
  permissionIds: number[];
}
