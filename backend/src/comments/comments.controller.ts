// Handles incoming HTTP requests for comments.

import { Controller, Post, Get, Patch, Delete, Body, Param, UseGuards, Req, HttpCode, HttpStatus, UsePipes, ValidationPipe } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create.comment.dto';
import { UpdateCommentDto } from './dto/update.comment.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.gaurd'; // Import the JWT Auth Guard
import { Request } from 'express'; // Import Request from express to get user from req.user

// Extend the Request interface to include the user property
// This is a common pattern in NestJS when using Passport.js
interface AuthRequest extends Request {
  user: any; // Or a more specific User type if you define it
}

@Controller('comments') // Base route for comment endpoints
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  @UseGuards(JwtAuthGuard) // Protect this route with JWT authentication
  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createCommentDto: CreateCommentDto, @Req() req: AuthRequest) {
    // req.user is populated by JwtAuthGuard with the authenticated user's data
    return this.commentsService.createComment(createCommentDto, req.user);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll() {
    return this.commentsService.findAllComments();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string) {
    return this.commentsService.findCommentById(id);
  }

  @UseGuards(JwtAuthGuard) // Protect this route
  @Patch(':id')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto, @Req() req: AuthRequest) {
    return this.commentsService.updateComment(id, updateCommentDto, req.user.id);
  }

  @UseGuards(JwtAuthGuard) // Protect this route
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT) // 204 No Content for successful deletion
  async softDelete(@Param('id') id: string, @Req() req: AuthRequest) {
    await this.commentsService.softDeleteComment(id, req.user.id);
    // No content to return for 204
  }

  @UseGuards(JwtAuthGuard) // Protect this route
  @Patch(':id/restore')
  @HttpCode(HttpStatus.OK)
  async restore(@Param('id') id: string, @Req() req: AuthRequest) {
    return this.commentsService.restoreComment(id, req.user.id);
  }
}
