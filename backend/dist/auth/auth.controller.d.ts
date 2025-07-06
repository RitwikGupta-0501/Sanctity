import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(registerUserDto: RegisterUserDto): Promise<Partial<import("../entities/user.entity").User>>;
    login(loginUserDto: LoginUserDto): Promise<{
        accessToken: string;
    }>;
}
