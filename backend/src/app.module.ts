// This is the root module of your NestJS application.
// It imports and configures other modules, including TypeOrmModule for database connectivity.

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config'; // For environment variables
import { User } from './entities/user.entity'; // Import the User entity
import { Comment } from './entities/comment.entity'; // Import the Comment entity
import { AuthModule } from './auth/auth.module';
import { CommentsModule } from './comments/comments.module';

@Module({
  imports: [
    // Configure ConfigModule to load environment variables
    ConfigModule.forRoot({
      isGlobal: true, // Makes ConfigService available globally
      envFilePath: '.env', // Assumes a .env file for local development (Docker uses env vars directly)
    }),
    // Configure TypeOrmModule asynchronously using ConfigService
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule], // Import ConfigModule to use ConfigService
      useFactory: (configService: ConfigService) => ({
        type: 'postgres', // Specify the database type
        host: configService.get<string>('DATABASE_HOST'),
        port: configService.get<number>('DATABASE_PORT'),
        username: configService.get<string>('DATABASE_USERNAME'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_NAME'),
        entities: [User, Comment], // Register your entities here
        synchronize: true, // WARNING: In production, use migrations instead of synchronize: true
        logging: true, // Enable logging for database queries (useful for development)
      }),
      inject: [ConfigService], // Inject ConfigService into the factory
    }),
    // Add other modules here as you create them (e.g., AuthModule, CommentsModule)
    AuthModule,
    CommentsModule
  ],
  controllers: [], // No root controllers needed for now
  providers: [],   // No root providers needed for now
})
export class AppModule {}