import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { Role } from 'src/roles/entities/role.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    private readonly entityManager: EntityManager,
  ) {}

  /**
   * Creates a new user in the system.
   *
   * This function checks if a user with the same email already exists,
   * verifies the existence of the specified role, hashes the user's password
   * for security, and saves the new user to the database.
   */
  async create(createUserDto: CreateUserDto) {
    // CHECK: If a user with the same email already exists
    const foundUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (foundUser) {
      throw new ConflictException('User with this email already exists');
    }

    // CHECK: If the role exists
    const foundRole = await this.roleRepository.findOne({
      where: { id: createUserDto.roleId },
    });

    if (!foundRole) {
      throw new BadRequestException('Role does not exist');
    }

    // SECURITY: Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = new User({
      ...createUserDto,
      password: hashedPassword,
      role: foundRole,
    });

    const newUser = await this.userRepository.save(user);

    // SECURITY: Remove the password from the response
    const { password, role, ...userWithoutPassword } = newUser;

    return { user: userWithoutPassword, role };
  }

  async updatePassword(user: User, newPassword: string) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;

    return this.entityManager.save(user);
  }

  /**
   * Finds a user by email address.
   *
   * This function checks if a user with the specified email exists in the system,
   * and if not, throws a `NotFoundException`.
   *
   * @warning This function does not remove the password from the response.
   */
  async findByEmail(email: string) {
    // CHECK: If a user with this email exists
    const foundUser = await this.userRepository.findOne({
      where: { email },
      relations: ['role'],
    });

    if (!foundUser) {
      throw new NotFoundException('User with this email does not exist');
    }

    const { role, ...user } = foundUser;

    // WARNING: This function does not remove the password from the response
    return { user, role };
  }

  async findById(id: number) {
    return this.userRepository.findOne({ where: { id } });
  }
}
