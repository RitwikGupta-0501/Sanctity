// Handles user registration, login, and JWT token generation.

import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs'; // Import bcryptjs for password hashing
import { User } from '../entities/user.entity';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService, // Inject JwtService
  ) {}

  /**
   * Registers a new user.
   * Hashes the password before saving.
   * @param registerUserDto User registration data.
   * @returns The newly created user (without password hash).
   */
  async register(registerUserDto: RegisterUserDto): Promise<Partial<User>> {
    const { username, email, password } = registerUserDto;

    // Check if username or email already exists
    const existingUser = await this.usersRepository.findOne({
      where: [{ username }, { email }],
    });

    if (existingUser) {
      if (existingUser.username === username) {
        throw new ConflictException('Username already exists');
      }
      if (existingUser.email === email) {
        throw new ConflictException('Email already exists');
      }
    }

    // Hash the password
    const salt = await bcrypt.genSalt();
    const password_hash = await bcrypt.hash(password, salt);

    const user = this.usersRepository.create({ username, email, password_hash });

    try {
      await this.usersRepository.save(user);
      // Return user data without the password hash
      const { password_hash: _, ...result } = user;
      return result;
    } catch (error) {
      // Handle potential database errors (e.g., unique constraint violation, though checked above)
      throw new BadRequestException('Failed to register user');
    }
  }

  /**
   * Logs in a user and generates a JWT token.
   * @param loginUserDto User login credentials.
   * @returns JWT access token.
   */
  async login(loginUserDto: LoginUserDto): Promise<{ accessToken: string }> {
    const { email, password } = loginUserDto;

    // Find user by email
    const user = await this.usersRepository.findOne({ where: { email } });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Compare provided password with stored hash
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT payload
    const payload = { userId: user.id, username: user.username, email: user.email };
    const accessToken = this.jwtService.sign(payload); // Sign the token

    return { accessToken };
  }

  /**
   * Validates a user based on JWT payload.
   * Used by JwtStrategy.
   * @param payload JWT payload.
   * @returns The user object.
   */
  async validateUser(payload: any): Promise<User> {
    const { userId } = payload;
    const user = await this.usersRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}