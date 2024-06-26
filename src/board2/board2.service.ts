import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/users/entities/users.entity';
import { Equal, Like, Repository, UpdateResult } from 'typeorm';
import { CreateBoard2Dto } from './dto/create-board2.dto';
import { Board2 } from './entities/board2.entity';

@Injectable()
export class Board2Service {
  constructor(
    @InjectRepository(Board2)
    private board2Repository: Repository<Board2>,
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
  ) {}

  async board2Info(page: number = 1): Promise<any> {
    try {
      const limit = 8;
      const skip = (page - 1) * limit;
      const take = limit;

      const board2 = await this.board2Repository.find({
        select: [
          'user_id',
          'board2_id',
          'discord_id',
          'meso',
          'report_kind',
          'title',
          'place_theif_nickname',
          'discord_global_name',
          'discord_image',
          'view_count',
          'complete',
          'created_at',
          'updated_at',
        ],
        skip,
        take,
        order: {
          created_at: 'DESC',
        },
        relations: ['Users'],
      });
      const currentTime = new Date(); 

      const modifiedBoard2 = board2.map(({ Users: { report_count, manner_count }, created_at, ...board }) => {
    
        const timeDifferenceInMs = currentTime.getTime() - new Date(created_at).getTime();
        let timeDifference: string;
  
        const minute = 60000;
        const hour = 3600000;
        const day = 86400000;
        const month = 2592000000; 
        const year = 31536000000; 
  
        if (timeDifferenceInMs < minute) { 
          timeDifference = '방금 전';
        } else if (timeDifferenceInMs < hour) { 
          timeDifference = `${Math.floor(timeDifferenceInMs / minute)}분`;
        } else if (timeDifferenceInMs < day) { 
          timeDifference = `${Math.floor(timeDifferenceInMs / hour)}시간`;
        } else if (timeDifferenceInMs < month) { 
          timeDifference = `${Math.floor(timeDifferenceInMs / day)}일`;
        } else if (timeDifferenceInMs < year) { 
          timeDifference = `${Math.floor(timeDifferenceInMs / month)}개월`;
        } else {
          timeDifference = `${Math.floor(timeDifferenceInMs / year)}년`;
        }
  
        return {
          ...board,
          report_count,
          manner_count,
          created_at,
          timeDifference, 
        };
      });

      return modifiedBoard2;
    } catch (error) {
      throw new HttpException(
        {
          status: 400,
          error: {
            message: '겹사 게시글 조회 에러',
            detail: error.message,
          },
        },
        400,
      );
    }
  }

  async board2PageCount(): Promise<any> {
    const board2Count = await this.board2Repository.count();
    return board2Count;
  }

  async board2ViewCount(board2_id: number): Promise<UpdateResult> {
    return await this.board2Repository.update(
      { board2_id },
      { view_count: () => 'view_count + 1' },
    );
  }

  async board2DetailInfo(board2_id: number): Promise<any> {
    try {
      const board2DetailInfo = await this.board2Repository.findOne({
        where: { board2_id },
        select: [
          'user_id',
          'board2_id',
          'discord_id',
          'meso',
          'title',
          'report_kind',
          'place_theif_nickname',
          'discord_global_name',
          'discord_image',
          'view_count',
          'complete',
          'created_at',
          'updated_at',
        ],
        order: {
          created_at: 'DESC',
        },
        relations: ['Users'],
      });
      await this.board2ViewCount(board2_id);

      const currentTime = new Date();

      const {
        Users: { report_count, manner_count },
        created_at,
        ...board2
      } = board2DetailInfo;
  
      
      const timeDifferenceInMs = currentTime.getTime() - new Date(created_at).getTime();
      let timeDifference: string;
  
      const minute = 60000;
      const hour = 3600000;
      const day = 86400000;
      const month = 2592000000; 
      const year = 31536000000; 
  
      if (timeDifferenceInMs < minute) {
        timeDifference = '방금 전';
      } else if (timeDifferenceInMs < hour) {
        timeDifference = `${Math.floor(timeDifferenceInMs / minute)}분 전`;
      } else if (timeDifferenceInMs < day) {
        timeDifference = `${Math.floor(timeDifferenceInMs / hour)}시간 전`;
      } else if (timeDifferenceInMs < month) {
        timeDifference = `${Math.floor(timeDifferenceInMs / day)}일 전`;
      } else if (timeDifferenceInMs < year) { 
        timeDifference = `${Math.floor(timeDifferenceInMs / month)}달 전`;
      } else {
        timeDifference = `${Math.floor(timeDifferenceInMs / year)}년 전`;
      }
  
      return {
        ...board2,
        report_count,
        manner_count,
        timeDifference, 
      };
    } catch (error) {
      throw new HttpException(
        {
          status: 400,
          error: {
            message: '겹사 게시글 상세 조회 에러',
            detail: error.message,
          },
        },
        400,
      );
    }
  }

  async board2SearchInfo(
    page: number = 1,
    searchMeso: number,
    searchReportKind: string,
    searchTitle: string,
    searchPlaceTheifNickname: string,
    searchDiscordName: string,
  ): Promise<any> {
    try {
      const limit = 8;
      const skip = (page - 1) * limit;
      const take = limit;

      const [searchedBoard2, totalCount] =
        await this.board2Repository.findAndCount({
          where: [
            searchMeso && { meso: Equal(searchMeso) },
            searchReportKind && { report_kind: Like(`%${searchReportKind}%`) },
            searchTitle && { title: Like(`%${searchTitle}%`) },
            searchPlaceTheifNickname && {
              place_theif_nickname: Like(`%${searchPlaceTheifNickname}%`),
            },
            searchDiscordName && {
              discord_global_name: Like(`%${searchDiscordName}%`),
            },
          ].filter(Boolean),
          select: [
            'user_id',
            'board2_id',
            'discord_id',
            'meso',
            'report_kind',
            'title',
            'place_theif_nickname',
            'discord_global_name',
            'discord_image',
            'view_count',
            'complete',
            'created_at',
            'updated_at',
          ],
          skip,
          take,
          order: {
            created_at: 'DESC',
          },
          relations: ['Users'],
        });

        const currentTime = new Date(); 

        const modifiedSearchBoard2 = searchedBoard2.map(({ Users: { report_count, manner_count }, created_at, ...board2 }) => {

          const timeDifferenceInMs = currentTime.getTime() - new Date(created_at).getTime();
          let timeDifference: string;
    
          const minute = 60000;
          const hour = 3600000;
          const day = 86400000;
          const month = 2592000000; 
          const year = 31536000000; 
    
          if (timeDifferenceInMs < minute) { 
            timeDifference = '방금 전';
          } else if (timeDifferenceInMs < hour) { 
            timeDifference = `${Math.floor(timeDifferenceInMs / minute)}분 전`;
          } else if (timeDifferenceInMs < day) { 
            timeDifference = `${Math.floor(timeDifferenceInMs / hour)}시간 전`;
          } else if (timeDifferenceInMs < month) { 
            timeDifference = `${Math.floor(timeDifferenceInMs / day)}일 전`;
          } else if (timeDifferenceInMs < year) {
            timeDifference = `${Math.floor(timeDifferenceInMs / month)}달 전`;
          } else { 
            timeDifference = `${Math.floor(timeDifferenceInMs / year)}년 전`;
          }
    
          return {
            ...board2,
            report_count,
            manner_count,
            timeDifference,
          };
        });

      return { search2Data: modifiedSearchBoard2, totalCount };
    } catch (error) {
      throw new HttpException(
        {
          status: 400,
          error: {
            message: '겹사 게시글 검색 조회 에러',
            detail: error.message,
          },
        },
        400,
      );
    }
  }

  async postBoard2(createBoard2Dto: CreateBoard2Dto, user): Promise<any> {
    try {
      const { meso, report_kind, title, place_theif_nickname } =
        createBoard2Dto;

      const createBoard2 = await this.board2Repository.create({
        user_id: user.user_id,
        meso,
        report_kind,
        title,
        place_theif_nickname,
        discord_id: user.discord_id,
        discord_username: user.username,
        discord_global_name: user.global_name,
        discord_image: user.avatar,
      });

      await this.board2Repository.save(createBoard2);
      return { msg: '겹사 게시글 등록이 완료되었습니다.' };
    } catch (error) {
      throw new HttpException(
        {
          status: 401,
          error: {
            message: '겹사 게시글 등록 에러',
            detail: error.message,
          },
        },
        401,
      );
    }
  }

  async completeBoard2(board2_id: number, user_id: any): Promise<any> {
    try {
      const board2 = await this.board2Repository.findOne({
        where: {
          board2_id,
        },
      });

      const user = await this.usersRepository.findOne({
        where: {
          user_id: user_id,
        },
      });

      if (!board2) {
        throw new NotFoundException('게시글이 존재하지 않습니다.');
      }

      // if(board2.user_id !== user_id) {
      //   throw new NotFoundException('다른 사람이 작성한 게시글에 완료처리를 할 수 없습니다.')
      // }

      if (board2.user_id === user.user_id) {
        if (!board2.complete) {
          board2.complete = true;
          user.progress_count += 1;
          await this.usersRepository.save(user);
        } else {
          board2.complete = false;
          user.progress_count -= 1;
          await this.usersRepository.save(user);
        }

        await this.board2Repository.save(board2);

        if (board2.complete) {
          return '게시글을 완료하였습니다.';
        } else {
          return '게시글의 완료를 취소하였습니다.';
        }
      } else {
        throw new Error('자신의 게시글만 완료처리 할 수 있습니다.');
      }
    } catch (error) {
      throw new HttpException(
        {
          status: 401,
          error: {
            message: '겹사 게시글 완료 에러',
            detail: error.message,
          },
        },
        401,
      );
    }
  }
}
