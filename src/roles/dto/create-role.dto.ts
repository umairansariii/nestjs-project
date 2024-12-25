import { IsDefined, IsNotEmpty, IsString } from 'class-validator';

export class CreateRoleDto {
  @IsNotEmpty({ message: 'Name should not empty' })
  @IsString({ message: 'Name must be a string' })
  @IsDefined({ message: 'Name is required' })
  name: string;
}
