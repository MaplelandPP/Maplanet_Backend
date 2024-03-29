import { Administrator } from 'src/administrator/entities/administrator.entity';
import { Board } from 'src/board/entities/board.entity';
import { Board2 } from 'src/board2/entities/board2.entity';
import { Manner } from 'src/manner/entities/manner.entity';
import { Party } from 'src/party/entities/party.entity';
import { Report } from 'src/report/entities/report.entity';
import { WoodCutter } from 'src/woodcutter/entities/woodcutter.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  user_id: number;

  @Column()
  discord_id: string;

  @Column()
  discord_username: string;

  @Column({
    nullable: true,
  })
  discord_global_name: string;

  @Column()
  discord_image: string;

  @Column()
  report_count: number;

  @Column()
  progress_count: number;

  @Column()
  manner_count: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @OneToMany(() => Board, (board) => board.Users, { cascade: true })
  boards: Board[];

  @OneToMany(() => Board2, (board2) => board2.Users, { cascade: true })
  boards2: Board2[];

  @OneToMany(() => WoodCutter, (boards3) => boards3.Users, { cascade: true })
  boards3: WoodCutter[];

  @OneToMany(() => Party, (boards4) => boards4.Users, { cascade: true })
  boards4: Party[];

  @OneToOne(() => Administrator, (administrator) => administrator.Users, {
    cascade: true,
  })
  administrators: Administrator[];

  @OneToMany(() => Report, (report) => report.reporter, { cascade: true })
  reports_reported: Report[];

  @OneToMany(() => Manner, (manner) => manner.manners, { cascade: true })
  manners_mannered: Manner[];
}
