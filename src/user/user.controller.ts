import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from 'src/guard/auth.guard';

@UseGuards(AuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findById(@Request() req: any) {
    const { user, role } = await this.userService.findById(req.userId);

    // SECURITY: Remove password from the response
    const { password, ...userWithoutPassword } = user;

    return {
      statusCode: 200,
      message: 'User retrieved successfully',
      data: { user: userWithoutPassword, role },
    };
  }
}
