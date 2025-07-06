// The comments module, bringing together comment components.

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from '../entities/comment.entity';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { AuthModule } from '../auth/auth.module'; // Import AuthModule for JwtAuthGuard

@Module({
  imports: [
    TypeOrmModule.forFeature([Comment]), // Make Comment entity repository available
    AuthModule, // Import AuthModule to use authentication guards
  ],
  providers: [CommentsService],
  controllers: [CommentsController],
  exports: [CommentsService], // Export CommentsService if needed by other modules
})
export class CommentsModule {}