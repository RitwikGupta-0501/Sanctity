import { Comment } from './comment.entity';
export declare class User {
    id: string;
    username: string;
    email: string;
    password_hash: string;
    created_at: Date;
    updated_at: Date;
    comments: Comment[];
}
