import { IsDefined, IsString, Matches, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @IsString({ message: 'Token must be a string' })
  @IsDefined({ message: 'Token is required' })
  resetToken: string;

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
  newPassword: string;
}
