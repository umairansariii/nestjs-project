import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from 'src/guard/auth.guard';

@UseGuards(AuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findById(@Request() req: any) {
    const user = await this.userService.findById(req.userId);
    delete user.password;

    return {
      statusCode: 200,
      message: 'User retrieved successfully',
      user,
    };
  }
}
