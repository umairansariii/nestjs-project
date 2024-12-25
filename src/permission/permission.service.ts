import { ConflictException, Injectable } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from './entities/permission.entity';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
    private readonly entityManager: EntityManager,
  ) {}

  async create(createPermissionDto: CreatePermissionDto) {
    const foundPermission = await this.permissionRepository.findOne({
      where: {
        resource: createPermissionDto.resource,
        action: createPermissionDto.action,
      },
    });

    if (foundPermission) {
      throw new ConflictException('Permission already exists');
    }

    const permission = new Permission({
      ...createPermissionDto,
    });

    const newPermission = await this.entityManager.save(permission);

    return {
      statusCode: 201,
      message: 'Permission created successfully',
      permission: newPermission,
    };
  }
}
