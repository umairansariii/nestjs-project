import { Body, Controller, Get, Param, Post } from '@nestjs/common';
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
      data: { roles },
    };
  }

  @Get(':id')
  async getRole(@Param('id') id: number) {
    const data = await this.rolesService.findOne(id);

    return {
      statusCode: 200,
      message: 'Role retrieved successfully',
      data,
    };
  }

  @Post()
  async createRole(@Body() createRoleDto: CreateRoleDto) {
    const data = await this.rolesService.create(createRoleDto);

    return {
      statusCode: 201,
      message: 'Role created successfully',
      data,
    };
  }
}
