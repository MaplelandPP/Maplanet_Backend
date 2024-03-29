import { Module } from '@nestjs/common';
import { BoardService } from './board.service';
import { BoardController } from './board.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Board } from './entities/board.entity';
import { UsersModule } from 'src/users/users.module';
import { Users } from 'src/users/entities/users.entity';
import { AuthModule } from 'src/auth/auth.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    TypeOrmModule.forFeature([Board, Users]),
    UsersModule,
    AuthModule,
    HttpModule,
  ],
  controllers: [BoardController],
  providers: [BoardService],
})
export class BoardModule {}
