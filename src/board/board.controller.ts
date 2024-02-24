import {
  Body,
  Controller,
  Get,
  Injectable,
  ParseIntPipe,
  Post,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { BoardService } from './board.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/common/auth.guard';
import { CreateBoardDto } from './dto/create-board.dto';
import { LoggingInterceptor } from 'src/logger/logger.interceptor';

@ApiTags('BOARD')
@Controller('board1')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @Get('/')
  @ApiOperation({
    summary: '잠쩔 게시글 전체 조회',
    description: '잠수 쩔 해주는 유저가 올린 게시글 전체 조회',
  })
  @ApiResponse({ status: 200, description: '잠쩔 게시글 전체 조회' })
  async boardInfo(@Query('page') page: number): Promise<any> {
    const getBoardInfo = await this.boardService.boardInfo(page);
    return getBoardInfo;
  }

  @Get('/search')
  @ApiOperation({
    summary: '잠쩔 게시글 검색 조회',
    description: '잠수 쩔 해주는 유저가 올린 게시글을 검색해서 전체 조회',
  })
  @ApiResponse({ status: 200, description: '잠쩔 게시글 전체 조회' })
  async boardSearchInfo(
    @Query('page') page: number,
    @Query('searchMeso') searchMeso: number,
    @Query('searchTitle') searchTitle: string,
    @Query('searchNickname') searchNickname: string,
    @Query('searchHuntingGround') searchHuntingGround: string,
    @Query('searchLevel') searchLevel: number,
    @Query('searchSubJob') searchSubJob: string,
    @Query('searchProgressKind') searchProgressKind: string,
    @Query('searchProgressTime') searchProgressTime: number,
    @Query('searchDiscordName') searchDiscordName: string,
  ): Promise<any> {
    const getBoardSearchInfo = await this.boardService.boardSearchInfo(
      page,
      searchMeso,
      searchTitle,
      searchNickname,
      searchHuntingGround,
      searchLevel,
      searchSubJob,
      searchProgressKind,
      searchProgressTime,
      searchDiscordName,
    );
    // console.log("asdfasdfasdfasdfsadfsa",getBoardSearchInfo)
    return getBoardSearchInfo;
  }

  @Post('/post')
  @UseGuards(AuthGuard)
  async postBoard(
    @Body() createBoardDto: CreateBoardDto,
    @Req() request: Request,
  ): Promise<any> {
    // const userId = request['user'].userId;
    console.log(createBoardDto);
    const getBoardInfo = await this.boardService.postBoard(
      createBoardDto,
      //userId
    );
    return getBoardInfo;
  }
}
