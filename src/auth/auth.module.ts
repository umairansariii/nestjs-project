import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResetToken } from './entities/reset-token.entity';
import { MailService } from 'src/services/mail.service';
import { RolesModule } from 'src/roles/roles.module';

@Module({
  imports: [UserModule, RolesModule, TypeOrmModule.forFeature([ResetToken])],
  controllers: [AuthController],
  providers: [AuthService, MailService],
  exports: [AuthService],
})
export class AuthModule {}
