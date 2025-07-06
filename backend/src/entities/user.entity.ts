// Defines the User entity, which maps to the 'users' table in the database.
// It includes fields for authentication and a relation to comments.

import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Comment } from './comment.entity'; // Import Comment entity for relation

@Entity('users') // Specifies the table name in the database
export class User {
  @PrimaryGeneratedColumn('uuid') // Generates a UUID for the primary key
  id: string;

  @Column({ unique: true, nullable: false })
  username: string;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ nullable: false })
  password_hash: string; // Storing the hashed password

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  // One user can have many comments
  @OneToMany(() => Comment, comment => comment.author)
  comments: Comment[];
}