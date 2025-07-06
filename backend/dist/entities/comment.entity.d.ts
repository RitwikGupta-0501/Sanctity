import { User } from './user.entity';
export declare class Comment {
    id: string;
    content: string;
    created_at: Date;
    updated_at: Date | null;
    deleted_at: Date | null;
    author: User;
    authorId: string;
    parent: Comment;
    parentId: string | null;
    children: Comment[];
}
