import {
  ArrayNotEmpty,
  ArrayUnique,
  IsArray,
  IsDefined,
  IsEnum,
  IsNotEmpty,
  IsString,
} from 'class-validator';
import { Resource } from '../enums/resource.enum';
import { Action } from '../enums/action.enum';

export class CreatePermissionDto {
  @IsEnum(Resource, { message: 'Invalid resource' })
  @IsNotEmpty({ message: 'Resource should not empty' })
  @IsString({ message: 'Resource must be a string' })
  @IsDefined({ message: 'Resource is required' })
  resource: Resource;

  @ArrayUnique({ message: 'Duplicate actions not allowed' })
  @IsEnum(Action, { each: true, message: 'Invalid actions' })
  @ArrayNotEmpty({ message: 'Actions should not empty' })
  @IsArray({ message: 'Actions must be an array' })
  @IsDefined({ message: 'Actions is required' })
  actions: Action[];
}
