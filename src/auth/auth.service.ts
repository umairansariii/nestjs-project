import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { SignupDto } from './dto/signup.dto';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async signup(signupDto: SignupDto) {
    const newUser = await this.userService.create(signupDto);

    return {
      message: 'Success',
      user: newUser,
    };
  }
}
