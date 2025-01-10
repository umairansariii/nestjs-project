import { Controller, Get, Query, Request, UseGuards } from '@nestjs/common';
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

  @Get('all')
  async findAll(
    @Request() req: any,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('roleId') roleId?: string,
    @Query('firstName') firstName?: string,
    @Query('lastName') lastName?: string,
    @Query('email') email?: string,
    @Query('isActive') isActive?: string,
  ) {
    const data = await this.userService.findAll(
      req.userId,
      parseInt(page, 10),
      parseInt(limit, 10),
      roleId,
      firstName,
      lastName,
      email,
      isActive,
    );

    return {
      statusCode: 200,
      message: 'Users retrieved successfully',
      data,
    };
  }
}
