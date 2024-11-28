import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { SignupDto } from './dto/signup.dto';
import { SigninDto } from './dto/signin.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(signupDto: SignupDto) {
    const existingUser = await this.userService.findByEmail(signupDto.email);

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const newUser = await this.userService.create(signupDto);
    delete newUser.password;

    return {
      statusCode: 201,
      message: 'User signed up successfully',
      user: newUser,
    };
  }

  async signin(signinDto: SigninDto) {
    const foundUser = await this.userService.findByEmail(signinDto.email);

    if (!foundUser) {
      throw new UnauthorizedException('User with this email does not exist');
    }

    const isPasswordMatch = await bcrypt.compare(
      signinDto.password,
      foundUser.password,
    );

    if (!isPasswordMatch) {
      throw new UnauthorizedException('Incorrect password');
    }

    delete foundUser.password;

    const payload = { sub: foundUser.id, email: foundUser.email };

    return {
      statusCode: 200,
      message: 'User signed in successfully',
      user: foundUser,
      access_token: this.jwtService.sign(payload),
    };
  }
}
