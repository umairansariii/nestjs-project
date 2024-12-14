import { IsDefined, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SigninDto {
  @IsEmail(undefined, { message: 'Email is not valid address' })
  @IsNotEmpty({ message: 'Email should not empty' })
  @IsDefined({ message: 'Email is required' })
  email: string;

  @IsNotEmpty({ message: 'Password should not empty' })
  @IsString({ message: 'Password must be a string' })
  @IsDefined({ message: 'Password is required' })
  password: string;
}
