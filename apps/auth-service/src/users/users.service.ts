import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dtos/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(
    createUserDto: CreateUserDto,
  ): Promise<Omit<User, 'password_hash'>> {
    const { username, email, password } = createUserDto;

    const existingUser = await this.usersRepository.findOne({
      where: [{ username }, { email }],
    });

    if (existingUser) {
      throw new ConflictException('Username or email already exists');
    }

    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    const user = this.usersRepository.create({
      username,
      email,
      password_hash,
    });

    const savedUser = await this.usersRepository.save(user);

    const { password_hash: _, ...result } = savedUser;
    return result;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findById(id: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async findByIdSafe(id: string): Promise<Omit<User, 'password_hash'>> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new Error('User not found');
    }
    const { password_hash, ...result } = user;
    return result;
  }

  async findAllSafe(): Promise<Omit<User, 'password_hash'>[]> {
    const users = await this.usersRepository.find();
    return users.map((user) => {
      const { password_hash, ...result } = user;
      return result;
    });
  }
}
