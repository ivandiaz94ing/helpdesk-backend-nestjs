import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Auth } from 'src/user/decorators/auth-decorator';
import { User } from 'src/user/entities/user.entity';
import { GetUser } from 'src/user/decorators/get-user-decorator';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post('idTicket')
  @Auth()
  create(
    @Param('idTicket') idTicket: string,
    @Body() createCommentDto: CreateCommentDto,
    @GetUser() user: User
  ) {
    return this.commentsService.create(createCommentDto, idTicket, user);
  }

  // @Get()
  // findAll() {
  //   return this.commentsService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.commentsService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
  //   return this.commentsService.update(+id, updateCommentDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.commentsService.remove(+id);
  // }
}
