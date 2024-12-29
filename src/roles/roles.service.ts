import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  /**
   * Creates a new role in the system.
   *
   * This method checks if a role with the given name already exists. If it does,
   * it throws a `ConflictException`. Otherwise, it creates a new role using the
   * provided `createRoleDto` and saves it to the repository.
   */
  async create(createRoleDto: CreateRoleDto) {
    const foundRole = await this.roleRepository.findOne({
      where: { name: createRoleDto.name },
    });

    if (foundRole) {
      throw new ConflictException('Role already exists');
    }

    const role = new Role({
      ...createRoleDto,
    });

    return this.roleRepository.save(role);
  }

  /**
   * Retrieves role by id, including its associated permissions.
   */
  async findOne(id: number) {
    const foundRole = await this.roleRepository.findOne({
      where: { id },
      relations: ['permissions'],
    });

    if (!foundRole) {
      throw new NotFoundException(`Role does not exist`);
    }

    return foundRole;
  }

  /**
   * Retrieves all roles from the repository.
   */
  async findAll() {
    return this.roleRepository.find();
  }
}
