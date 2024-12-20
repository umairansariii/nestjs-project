import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { SignupDto } from './dto/signup.dto';
import { SigninDto } from './dto/signin.dto';
import { JwtService } from '@nestjs/jwt';
import { ChangePasswordDto } from './dto/change-password.dto';
import { nanoid } from 'nanoid';
import { ResetToken } from './entities/reset-token.entity';
import { EntityManager } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly entityManager: EntityManager,
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
      throw new NotFoundException('User with this email does not exist');
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

  async changePassword(changePasswordDto: ChangePasswordDto, userId: number) {
    const user = await this.userService.findById(userId);

    const isPasswordMatch = await bcrypt.compare(
      changePasswordDto.oldPassword,
      user.password,
    );

    if (!isPasswordMatch) {
      throw new BadRequestException('Password does not match');
    }

    await this.userService.updatePassword(user, changePasswordDto.newPassword);

    return {
      statusCode: 200,
      message: 'Password changed successfully',
    };
  }

  async forgotPassword(email: string) {
    const foundUser = await this.userService.findByEmail(email);

    if (foundUser) {
      const resetPasswordToken = nanoid(64);

      const resetToken = new ResetToken({
        userId: foundUser.id,
        token: resetPasswordToken,
        expiryDate: new Date(Date.now() + 3600000),
      });

      await this.entityManager.save(resetToken);
    }

    return {
      statusCode: 200,
      message: 'Email sent successfully',
    };
  }
}
