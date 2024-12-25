import { Body, Controller, Get, Post } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get('all')
  async getRoles() {
    const roles = await this.rolesService.findAll();

    return {
      statusCode: 200,
      message: 'Roles retrieved successfully',
      roles,
    };
  }

  @Post()
  async createRole(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }
}
