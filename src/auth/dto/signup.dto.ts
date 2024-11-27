import {
  IsAlpha,
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class SignupDto {
  @IsAlpha('en-US', { message: 'First name must contain only letters' })
  @IsNotEmpty({ message: 'First name should not empty' })
  firstName: string;

  @IsAlpha('en-US', { message: 'Last name must contain only letters' })
  @IsNotEmpty({ message: 'Last name should not empty' })
  lastName: string;

  @IsEmail(undefined, { message: 'Email is not valid address' })
  @IsNotEmpty({ message: 'Email should not empty' })
  email: string;

  @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*\W).+$/, {
    message: 'Password is not strong enough',
  })
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  @IsString({ message: 'Password must be a string' })
  password: string;
}
