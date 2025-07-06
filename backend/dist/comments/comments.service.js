"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const comment_entity_1 = require("../entities/comment.entity");
let CommentsService = class CommentsService {
    commentsRepository;
    EDIT_GRACE_PERIOD_MS = 15 * 60 * 1000;
    DELETE_GRACE_PERIOD_MS = 15 * 60 * 1000;
    constructor(commentsRepository) {
        this.commentsRepository = commentsRepository;
    }
    async createComment(createCommentDto, author) {
        const { content, parentId } = createCommentDto;
        let parentComment = null;
        if (parentId) {
            parentComment = await this.commentsRepository.findOne({
                where: { id: parentId, deleted_at: (0, typeorm_2.IsNull)() },
            });
            if (!parentComment) {
                throw new common_1.NotFoundException('Parent comment not found or already deleted');
            }
        }
        const comment = this.commentsRepository.create({
            content,
            author,
            parent: parentComment,
        });
        return this.commentsRepository.save(comment);
    }
    async findAllComments() {
        return this.commentsRepository.find({
            where: { parent: (0, typeorm_2.IsNull)(), deleted_at: (0, typeorm_2.IsNull)() },
            relations: ['author', 'children', 'children.author', 'children.children', 'children.children.author'],
            order: {
                created_at: 'DESC',
                children: {
                    created_at: 'ASC',
                    children: {
                        created_at: 'ASC',
                    },
                },
            },
        });
    }
    async findCommentById(id) {
        const comment = await this.commentsRepository.findOne({
            where: { id, deleted_at: (0, typeorm_2.IsNull)() },
            relations: ['author', 'parent', 'children'],
        });
        if (!comment) {
            throw new common_1.NotFoundException('Comment not found or deleted');
        }
        return comment;
    }
    async updateComment(id, updateCommentDto, userId) {
        const comment = await this.commentsRepository.findOne({
            where: { id, deleted_at: (0, typeorm_2.IsNull)() },
            relations: ['author'],
        });
        if (!comment) {
            throw new common_1.NotFoundException('Comment not found or deleted');
        }
        if (comment.author.id !== userId) {
            throw new common_1.ForbiddenException('You are not authorized to edit this comment');
        }
        const now = new Date();
        const createdAt = new Date(comment.created_at);
        const timeElapsed = now.getTime() - createdAt.getTime();
        if (timeElapsed > this.EDIT_GRACE_PERIOD_MS) {
            throw new common_1.ForbiddenException('Comments can only be edited within 15 minutes of posting');
        }
        comment.content = updateCommentDto.content;
        comment.updated_at = now;
        return this.commentsRepository.save(comment);
    }
    async softDeleteComment(id, userId) {
        const comment = await this.commentsRepository.findOne({
            where: { id, deleted_at: (0, typeorm_2.IsNull)() },
            relations: ['author'],
        });
        if (!comment) {
            throw new common_1.NotFoundException('Comment not found or already deleted');
        }
        if (comment.author.id !== userId) {
            throw new common_1.ForbiddenException('You are not authorized to delete this comment');
        }
        comment.deleted_at = new Date();
        return this.commentsRepository.save(comment);
    }
    async restoreComment(id, userId) {
        const comment = await this.commentsRepository.findOne({
            where: { id },
            withDeleted: true,
            relations: ['author'],
        });
        if (!comment) {
            throw new common_1.NotFoundException('Comment not found');
        }
        if (comment.author.id !== userId) {
            throw new common_1.ForbiddenException('You are not authorized to restore this comment');
        }
        if (!comment.deleted_at) {
            throw new common_1.BadRequestException('Comment is not soft-deleted');
        }
        const now = new Date();
        const deletedAt = new Date(comment.deleted_at);
        const timeElapsed = now.getTime() - deletedAt.getTime();
        if (timeElapsed > this.DELETE_GRACE_PERIOD_MS) {
            throw new common_1.ForbiddenException('Comments can only be restored within 15 minutes of deletion');
        }
        comment.deleted_at = null;
        return this.commentsRepository.save(comment);
    }
};
exports.CommentsService = CommentsService;
exports.CommentsService = CommentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(comment_entity_1.Comment)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CommentsService);
//# sourceMappingURL=comments.service.js.map