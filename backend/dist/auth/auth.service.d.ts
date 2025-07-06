import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from '../entities/user.entity';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
export declare class AuthService {
    private usersRepository;
    private jwtService;
    constructor(usersRepository: Repository<User>, jwtService: JwtService);
    register(registerUserDto: RegisterUserDto): Promise<Partial<User>>;
    login(loginUserDto: LoginUserDto): Promise<{
        accessToken: string;
    }>;
    validateUser(payload: any): Promise<User>;
}
