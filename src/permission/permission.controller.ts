import { Body, Controller, Post } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { CreatePermissionDto } from './dto/create-permission.dto';

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
}
