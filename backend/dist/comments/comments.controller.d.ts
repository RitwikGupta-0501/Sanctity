import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create.comment.dto';
import { UpdateCommentDto } from './dto/update.comment.dto';
import { Request } from 'express';
interface AuthRequest extends Request {
    user: any;
}
export declare class CommentsController {
    private commentsService;
    constructor(commentsService: CommentsService);
    create(createCommentDto: CreateCommentDto, req: AuthRequest): Promise<import("../entities/comment.entity").Comment>;
    findAll(): Promise<import("../entities/comment.entity").Comment[]>;
    findOne(id: string): Promise<import("../entities/comment.entity").Comment>;
    update(id: string, updateCommentDto: UpdateCommentDto, req: AuthRequest): Promise<import("../entities/comment.entity").Comment>;
    softDelete(id: string, req: AuthRequest): Promise<void>;
    restore(id: string, req: AuthRequest): Promise<import("../entities/comment.entity").Comment>;
}
export {};
