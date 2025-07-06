// Handles the business logic for comments.

import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Comment } from '../entities/comment.entity';
import { User } from '../entities/user.entity'; // Import User entity to type the author
import { CreateCommentDto } from './dto/create.comment.dto';
import { UpdateCommentDto } from './dto/update.comment.dto';

@Injectable()
export class CommentsService {
  private readonly EDIT_GRACE_PERIOD_MS = 15 * 60 * 1000; // 15 minutes in milliseconds
  private readonly DELETE_GRACE_PERIOD_MS = 15 * 60 * 1000; // 15 minutes in milliseconds

  constructor(
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
  ) {}

  /**
   * Creates a new comment or a reply.
   * @param createCommentDto Data for the new comment.
   * @param author The user creating the comment.
   * @returns The created comment.
   */
  async createComment(createCommentDto: CreateCommentDto, author: User): Promise<Comment> {
    const { content, parentId } = createCommentDto;
    let parentComment: Comment | null = null;

    if (parentId) {
      parentComment = await this.commentsRepository.findOne({
        where: { id: parentId, deleted_at: IsNull() }, // Ensure parent is not soft-deleted
      });
      if (!parentComment) {
        throw new NotFoundException('Parent comment not found or already deleted');
      }
    }

    const comment = this.commentsRepository.create({
      content,
      author,
      parent: parentComment, // Set the parent relationship
    });

    return this.commentsRepository.save(comment);
  }

  /**
   * Retrieves all top-level comments and their nested children.
   * Only retrieves comments that are not soft-deleted.
   * @returns An array of comments with nested children.
   */
  async findAllComments(): Promise<Comment[]> {
    // Find top-level comments (where parent is null) that are not deleted
    return this.commentsRepository.find({
      where: { parent: IsNull(), deleted_at: IsNull() },
      relations: ['author', 'children', 'children.author', 'children.children', 'children.children.author'], // Eager load children and their authors for nesting
      order: {
        created_at: 'DESC', // Order top-level comments by creation date
        children: {
          created_at: 'ASC', // Order children comments by creation date
          children: {
            created_at: 'ASC',
          },
        },
      },
    });
    // Note: For very deep nesting, you might need a more complex query or
    // a recursive approach on the fetched data to limit depth or optimize.
    // For this challenge, eager loading a few levels is a good start.
  }

  /**
   * Retrieves a single comment by ID.
   * @param id The ID of the comment.
   * @returns The comment.
   */
  async findCommentById(id: string): Promise<Comment> {
    const comment = await this.commentsRepository.findOne({
      where: { id, deleted_at: IsNull() },
      relations: ['author', 'parent', 'children'],
    });
    if (!comment) {
      throw new NotFoundException('Comment not found or deleted');
    }
    return comment;
  }

  /**
   * Updates a comment's content.
   * Only allowed within 15 minutes of posting and by the original author.
   * @param id The ID of the comment to update.
   * @param updateCommentDto New content for the comment.
   * @param userId The ID of the user attempting to update.
   * @returns The updated comment.
   */
  async updateComment(id: string, updateCommentDto: UpdateCommentDto, userId: string): Promise<Comment> {
    const comment = await this.commentsRepository.findOne({
      where: { id, deleted_at: IsNull() },
      relations: ['author'], // Load author to check ownership
    });

    if (!comment) {
      throw new NotFoundException('Comment not found or deleted');
    }

    if (comment.author.id !== userId) {
      throw new ForbiddenException('You are not authorized to edit this comment');
    }

    const now = new Date();
    const createdAt = new Date(comment.created_at);
    const timeElapsed = now.getTime() - createdAt.getTime();

    if (timeElapsed > this.EDIT_GRACE_PERIOD_MS) {
      throw new ForbiddenException('Comments can only be edited within 15 minutes of posting');
    }

    comment.content = updateCommentDto.content;
    comment.updated_at = now; // Update the updated_at timestamp

    return this.commentsRepository.save(comment);
  }

  /**
   * Soft deletes a comment.
   * @param id The ID of the comment to delete.
   * @param userId The ID of the user attempting to delete.
   * @returns The soft-deleted comment.
   */
  async softDeleteComment(id: string, userId: string): Promise<Comment> {
    const comment = await this.commentsRepository.findOne({
      where: { id, deleted_at: IsNull() }, // Ensure comment exists and is not already deleted
      relations: ['author'],
    });

    if (!comment) {
      throw new NotFoundException('Comment not found or already deleted');
    }

    if (comment.author.id !== userId) {
      throw new ForbiddenException('You are not authorized to delete this comment');
    }

    comment.deleted_at = new Date(); // Set the deleted_at timestamp
    return this.commentsRepository.save(comment);
  }

  /**
   * Restores a soft-deleted comment.
   * Only allowed within 15 minutes of soft deletion and by the original author.
   * @param id The ID of the comment to restore.
   * @param userId The ID of the user attempting to restore.
   * @returns The restored comment.
   */
  async restoreComment(id: string, userId: string): Promise<Comment> {
    // Find the comment, even if it's soft-deleted
    const comment = await this.commentsRepository.findOne({
      where: { id },
      withDeleted: true, // Include soft-deleted entities in the search
      relations: ['author'],
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (comment.author.id !== userId) {
      throw new ForbiddenException('You are not authorized to restore this comment');
    }

    if (!comment.deleted_at) {
      throw new BadRequestException('Comment is not soft-deleted');
    }

    const now = new Date();
    const deletedAt = new Date(comment.deleted_at);
    const timeElapsed = now.getTime() - deletedAt.getTime();

    if (timeElapsed > this.DELETE_GRACE_PERIOD_MS) {
      throw new ForbiddenException('Comments can only be restored within 15 minutes of deletion');
    }

    comment.deleted_at = null; // Remove the deleted_at timestamp to restore
    return this.commentsRepository.save(comment);
  }
}