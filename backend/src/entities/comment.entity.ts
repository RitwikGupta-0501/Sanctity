// Defines the Comment entity, which maps to the 'comments' table.
// It includes fields for content, nesting, and soft deletion.

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, RelationId, Tree, TreeChildren, TreeParent } from 'typeorm';
import { User } from './user.entity'; // Import User entity for author relation

@Entity('comments') // Specifies the table name in the database
@Tree('closure-table') // Enables tree structure for nested comments using a closure table
export class Comment {
  @PrimaryGeneratedColumn('uuid') // Generates a UUID for the primary key
  id: string;

  @Column({ type: 'text', nullable: false })
  content: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: null, nullable: true })
  updated_at: Date | null; // Nullable, as it's only set on update

  @Column({ type: 'timestamp', default: null, nullable: true })
  deleted_at: Date | null; // For soft deletion

  // Many comments can belong to one author (User)
  @ManyToOne(() => User, user => user.comments, { onDelete: 'CASCADE' })
  author: User;

  @RelationId((comment: Comment) => comment.author) // Explicitly define the relation ID column
  authorId: string;

  // For nested comments:
  // Many comments can have one parent comment
  @TreeParent()
  parent: Comment;

  @RelationId((comment: Comment) => comment.parent) // Explicitly define the relation ID column for parent
  parentId: string | null; // Nullable for top-level comments

  // One comment can have many children comments
  @TreeChildren({ cascade: true }) // Cascade operations to children (e.g., delete parent, delete children)
  children: Comment[];
}