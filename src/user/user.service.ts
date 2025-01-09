import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
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

  /**
   * Updates the password of a given user.
   *
   * This function hashes the new password and updates the user's password
   * in the database.
   *
   * @warning This function does not remove the password from the response.
   */
  async updatePassword(user: User, newPassword: string) {
    // SECURITY: Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const updatedUser = new User({ ...user, password: hashedPassword });

    // WARNING: This function does not remove the password from the response
    return this.userRepository.save(updatedUser);
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

  /**
   * Finds a user by identity.
   *
   * This function checks if a user with the specified identity exists in the
   * system, and if not, throws a `NotFoundException`.
   *
   * @warning This function does not remove the password from the response.
   */
  async findById(id: number) {
    // CHECK: If a user with this identity exists
    const foundUser = await this.userRepository.findOne({
      where: { id },
      relations: ['role'],
    });

    if (!foundUser) {
      throw new NotFoundException('User with this identity does not exist');
    }

    const { role, ...user } = foundUser;

    // WARNING: This function does not remove the password from the response
    return { user, role };
  }

  /**
   * Finds all users in the system.
   *
   * This function checks if the user has privileges to access this resource,
   * and if not, throws a `ForbiddenException`.
   *
   * @pagination This function accepts `page` and `limit` query parameters.
   */
  async findAll(userId: number, page = 1, limit = 10) {
    // CHECK: If user has privileges to access this resource
    const { role } = await this.findById(userId);

    if (!['Master', 'Admin'].includes(role.name)) {
      throw new ForbiddenException('Access denied');
    }

    const [users, total] = await this.userRepository.findAndCount({
      select: [
        'id',
        'createdAt',
        'deletedAt',
        'firstName',
        'lastName',
        'email',
        'isActive',
        'roleId',
      ],
      skip: (page - 1) * limit,
      take: limit,
    });

    const meta = { page, limit, total, pageCount: Math.ceil(total / limit) };

    return { users, meta };
  }
}
