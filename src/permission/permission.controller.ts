import { Body, Controller, Post, Put } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { AssignPermissionDto } from './dto/assign-permission.dto';

@Controller('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Post()
  async createPermission(@Body() createPermissionDto: CreatePermissionDto) {
    const permissions =
      await this.permissionService.create(createPermissionDto);

    return {
      statusCode: 201,
      message: 'Permission created successfully',
      permissions,
    };
  }

  @Put('assign')
  async assignPermission(@Body() assignPermissionDto: AssignPermissionDto) {
    const role = await this.permissionService.assign(assignPermissionDto);

    return {
      statusCode: 200,
      message: 'Permission assigned successfully',
      role,
    };
  }
}
