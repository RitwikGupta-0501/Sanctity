// The authentication module, bringing together authentication components.

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from '../entities/user.entity'; // Import User entity
import { JwtStrategy } from './jwt.strategy'; // Import JwtStrategy

@Module({
  imports: [
    // Import TypeOrmModule.forFeature to make the User entity repository available
    TypeOrmModule.forFeature([User]),
    // Configure PassportModule
    PassportModule.register({ defaultStrategy: 'jwt' }),
    // Configure JwtModule asynchronously to use ConfigService for secret
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'), // Get JWT secret from environment variables
        signOptions: { expiresIn: '1h' }, // Token expiration time
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, JwtStrategy], // Register AuthService and JwtStrategy
  controllers: [AuthController], // Register AuthController
  exports: [PassportModule, JwtModule, AuthService], // Export modules/services for use in other modules
})
export class AuthModule {}