import { Users } from 'src/users/entities/users.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class WoodCutter {
  @PrimaryGeneratedColumn()
  board3_id: number;

  @Column({ type: 'int' })
  user_id: number;
  @ManyToOne(() => Users, (Users) => Users.user_id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  Users: Users;

  @Column()
  discord_id: string;

  @Column()
  meso: number;

  @Column()
  title: string;

  @Column()
  hunting_ground: string;

  @Column()
  main_job: string;

  @Column()
  sub_job: string;

  @Column()
  level: number;

  @Column()
  maple_nickname: string;

  @Column()
  progress_time: number;

  @Column()
  discord_username: string;

  @Column({ nullable: true })
  discord_global_name: string;

  @Column()
  discord_image: string;

  @Column()
  view_count: number;

  @Column()
  complete: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
