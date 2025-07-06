// DTO for updating an existing comment.

import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class UpdateCommentDto {
  @IsString()
  @IsNotEmpty({ message: 'Comment content cannot be empty' })
  @MaxLength(1000, { message: 'Comment content cannot exceed 1000 characters' })
  content: string;
}