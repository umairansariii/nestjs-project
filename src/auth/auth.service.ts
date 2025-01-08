import {
  BadRequestException,
  Injectable,
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
import { MoreThan, Repository } from 'typeorm';
import { MailService } from 'src/services/mail.service';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { RolesService } from 'src/roles/roles.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(ResetToken)
    private readonly resetTokenRepository: Repository<ResetToken>,
    private readonly userService: UserService,
    private readonly rolesService: RolesService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  /**
   * Registers a new user in the system.
   */
  async signup(signupDto: SignupDto) {
    const { user, role } = await this.userService.create(signupDto);

    // EMAIL: Send welcome greeting email
    this.mailService.sendSignupEmail(user.email, user.firstName);

    const payload = { sub: user.id, email: user.email };

    return {
      user,
      role,
      access_token: this.jwtService.sign(payload),
    };
  }

  /**
   * Authenticates a user by verifying their email and password.
   */
  async signin(signinDto: SigninDto) {
    const { user, role } = await this.userService.findByEmail(signinDto.email);

    // CHECK: If the password with the hashed password is matched
    const isPasswordMatch = await bcrypt.compare(
      signinDto.password,
      user.password,
    );

    if (!isPasswordMatch) {
      throw new UnauthorizedException('Incorrect password');
    }

    const payload = { sub: user.id, email: user.email };

    // SECURITY: Remove the password from the response
    const { password, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      role,
      access_token: this.jwtService.sign(payload),
    };
  }

  /**
   * Changes the password of a user.
   */
  async changePassword(changePasswordDto: ChangePasswordDto, userId: number) {
    const { user } = await this.userService.findById(userId);

    // CHECK: If the password matches the current password
    const isPasswordMatch = await bcrypt.compare(
      changePasswordDto.oldPassword,
      user.password,
    );

    if (!isPasswordMatch) {
      throw new BadRequestException('Password does not match');
    }

    return this.userService.updatePassword(user, changePasswordDto.newPassword);
  }

  /**
   * Sends a password reset email to the user.
   */
  async forgotPassword(email: string) {
    const { user } = await this.userService.findByEmail(email);

    // CHECK: If the user exists
    if (user) {
      const resetPasswordToken = nanoid(64);

      const resetToken = new ResetToken({
        userId: user.id,
        token: resetPasswordToken,
        expiryDate: new Date(Date.now() + 3600000),
      });

      // EMAIL: Send password reset email
      this.mailService.sendPasswordResetEmail(email, resetPasswordToken);

      return this.resetTokenRepository.save(resetToken);
    }
  }

  /**
   * Resets the password of a user.
   */
  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    // CHECK: If the token is valid and not expired
    const foundToken = await this.resetTokenRepository.findOne({
      where: {
        token: resetPasswordDto.resetToken,
        expiryDate: MoreThan(new Date()),
      },
    });

    if (!foundToken) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    const { user } = await this.userService.findById(foundToken.userId);

    await this.userService.updatePassword(user, resetPasswordDto.newPassword);

    return this.resetTokenRepository.delete(foundToken.userId);
  }

  /**
   * Retrieves the permissions of a user.
   */
  async getUserPermissions(userId: number) {
    const { user } = await this.userService.findById(userId);
    const { permissions } = await this.rolesService.findOne(user.roleId);

    return permissions;
  }
}
