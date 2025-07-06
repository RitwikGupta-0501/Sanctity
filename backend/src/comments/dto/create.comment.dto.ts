// DTO for creating a new comment or a reply.

import { IsString, IsNotEmpty, IsOptional, IsUUID, MaxLength } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty({ message: 'Comment content cannot be empty' })
  @MaxLength(1000, { message: 'Comment content cannot exceed 1000 characters' })
  content: string;

  @IsOptional() // parentId is optional for top-level comments
  @IsUUID('4', { message: 'Invalid parent comment ID format' }) // Validate UUID format
  parentId?: string; // Optional: ID of the parent comment if it's a reply
}