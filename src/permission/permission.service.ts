import { ConflictException, Injectable } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from './entities/permission.entity';
import { In, Repository } from 'typeorm';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  /**
   * Creates new permissions in the system.
   *
   * This method checks if the permissions already exist for the given resource and actions.
   * If any of the permissions already exist, it throws a ConflictException.
   * Otherwise, it creates new permissions and saves them to the repository.
   */
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

    return this.permissionRepository.save(permissions);
  }
}
