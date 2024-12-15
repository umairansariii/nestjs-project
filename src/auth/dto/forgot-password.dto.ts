import { IsDefined, IsEmail, IsNotEmpty } from 'class-validator';

export class ForgotPasswordDto {
  @IsEmail(undefined, { message: 'Email is not valid address' })
  @IsNotEmpty({ message: 'Email should not empty' })
  @IsDefined({ message: 'Email is required' })
  email: string;
}
