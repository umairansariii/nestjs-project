import { Body, Controller, Get, Post, Put } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { AssignPermissionDto } from './dto/assign-permission.dto';

@Controller('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Get('all')
  async getPermissions() {
    const permissions = await this.permissionService.findAll();

    return {
      statusCode: 200,
      message: 'Permissions retrieved successfully',
      data: { permissions },
    };
  }

  @Post()
  async createPermission(@Body() createPermissionDto: CreatePermissionDto) {
    const data = await this.permissionService.create(createPermissionDto);

    return {
      statusCode: 201,
      message: 'Permissions created successfully',
      data,
    };
  }

  @Put('assign')
  async assignPermission(@Body() assignPermissionDto: AssignPermissionDto) {
    const data = await this.permissionService.assign(assignPermissionDto);

    return {
      statusCode: 200,
      message: 'Permissions assigned successfully',
      data,
    };
  }
}
