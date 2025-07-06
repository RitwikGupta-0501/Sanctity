import { Repository } from 'typeorm';
import { Comment } from '../entities/comment.entity';
import { User } from '../entities/user.entity';
import { CreateCommentDto } from './dto/create.comment.dto';
import { UpdateCommentDto } from './dto/update.comment.dto';
export declare class CommentsService {
    private commentsRepository;
    private readonly EDIT_GRACE_PERIOD_MS;
    private readonly DELETE_GRACE_PERIOD_MS;
    constructor(commentsRepository: Repository<Comment>);
    createComment(createCommentDto: CreateCommentDto, author: User): Promise<Comment>;
    findAllComments(): Promise<Comment[]>;
    findCommentById(id: string): Promise<Comment>;
    updateComment(id: string, updateCommentDto: UpdateCommentDto, userId: string): Promise<Comment>;
    softDeleteComment(id: string, userId: string): Promise<Comment>;
    restoreComment(id: string, userId: string): Promise<Comment>;
}
