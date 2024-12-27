import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from './entities/permission.entity';
import { In, Repository } from 'typeorm';
import { Role } from 'src/roles/entities/role.entity';
import { AssignPermissionDto } from './dto/assign-permission.dto';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
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

  /**
   * Assigns permissions to a role.
   *
   * This method finds a role by its ID and assigns the specified permissions to it.
   * If the role or any of the permissions do not exist, it throws a NotFoundException.
   * It ensures that only unique permissions are added to the role.
   */
  async assign(assignPermissionDto: AssignPermissionDto) {
    const foundRole = await this.roleRepository.findOne({
      where: { id: assignPermissionDto.roleId },
      relations: ['permissions'],
    });

    if (!foundRole) {
      throw new NotFoundException('Role does not exist');
    }

    const foundPermissions = await this.permissionRepository.find({
      where: { id: In(assignPermissionDto.permissionIds) },
    });

    if (foundPermissions.length !== assignPermissionDto.permissionIds.length) {
      throw new NotFoundException("Some permissions don't exist");
    }

    const uniquePermissions = foundPermissions.filter(
      (permission) =>
        !foundRole.permissions.some((p) => p.id === permission.id),
    );

    foundRole.permissions = [...foundRole.permissions, ...uniquePermissions];

    return this.roleRepository.save(foundRole);
  }

  /**
   * Retrieves all permissions from the repository.
   */
  async findAll() {
    return this.permissionRepository.find();
  }
}
