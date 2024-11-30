import { IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @IsNotEmpty({ message: 'Password should not empty' })
  @IsString({ message: 'Password must be a string' })
  oldPassword: string;

  @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*\W).+$/, {
    message: 'Password is not strong enough',
  })
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  @IsString({ message: 'Password must be a string' })
  newPassword: string;
}
