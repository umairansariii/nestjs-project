import { IsDefined, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Resource } from '../enums/resource.enum';
import { Action } from '../enums/action.enum';

export class CreatePermissionDto {
  @IsEnum(Resource, { message: 'Invalid resource' })
  @IsNotEmpty({ message: 'Resource should not empty' })
  @IsString({ message: 'Resource must be a string' })
  @IsDefined({ message: 'Resource is required' })
  resource: Resource;

  @IsEnum(Action, { message: 'Invalid action' })
  @IsNotEmpty({ message: 'Action should not empty' })
  @IsString({ message: 'Action must be a string' })
  @IsDefined({ message: 'Action is required' })
  action: Action;
}
