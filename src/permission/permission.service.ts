import { ConflictException, Injectable } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from './entities/permission.entity';
import { EntityManager, In, Repository } from 'typeorm';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
    private readonly entityManager: EntityManager,
  ) {}

  async create(createPermissionDto: CreatePermissionDto) {
    const foundPermissions = await this.permissionRepository.find({
      where: {
        resource: createPermissionDto.resource,
        action: In(createPermissionDto.actions),
      },
    });

    if (foundPermissions.length > 0) {
      throw new ConflictException(
        `Permission already exists: [${foundPermissions.map((p) => p.action).join(', ')}]`,
      );
    }

    const permissions = createPermissionDto.actions.map(
      (action) =>
        new Permission({
          resource: createPermissionDto.resource,
          action,
        }),
    );

    const newPermissions = await this.entityManager.save(permissions);

    return {
      statusCode: 201,
      message: 'Permission created successfully',
      permission: newPermissions,
    };
  }
}
