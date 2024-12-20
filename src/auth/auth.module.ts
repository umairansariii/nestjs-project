import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResetToken } from './entities/reset-token.entity';
import { MailService } from 'src/services/mail.service';

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([ResetToken])],
  controllers: [AuthController],
  providers: [AuthService, MailService],
})
export class AuthModule {}
