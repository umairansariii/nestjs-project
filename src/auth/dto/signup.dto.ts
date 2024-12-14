import {
  IsAlpha,
  IsDefined,
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class SignupDto {
  @IsAlpha('en-US', { message: 'First name must contain only letters' })
  @IsNotEmpty({ message: 'First name should not empty' })
  @IsString({ message: 'First name must be a string' })
  @IsDefined({ message: 'First name is required' })
  firstName: string;

  @IsAlpha('en-US', { message: 'Last name must contain only letters' })
  @IsNotEmpty({ message: 'Last name should not empty' })
  @IsString({ message: 'Last name must be a string' })
  @IsDefined({ message: 'Last name is required' })
  lastName: string;

  @IsEmail(undefined, { message: 'Email is not valid address' })
  @IsNotEmpty({ message: 'Email should not empty' })
  @IsDefined({ message: 'Email is required' })
  email: string;

  @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*\W).+$/, {
    message: 'Password is not strong enough',
    context: {
      message:
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    },
  })
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  @IsString({ message: 'Password must be a string' })
  @IsDefined({ message: 'Password is required' })
  password: string;
}
