import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { GetTicketsFilterDto } from './dto/get-tickets-filter.dto';

import { Auth } from 'src/user/decorators/auth-decorator';
import { ValidRoles } from 'src/user/interfaces/validRoles';
import { GetUser } from 'src/user/decorators/get-user-decorator';
import { User } from 'src/user/entities/user.entity';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('ticket')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @Post()
  @Auth(ValidRoles.CLIENT, ValidRoles.ADMIN)
  @UseInterceptors(FilesInterceptor('images', 3))
  create(
    @Body() createTicketDto: CreateTicketDto,
    @GetUser() user: User,
    @UploadedFiles() files: Array<Express.Multer.File>
  ) {
    return this.ticketService.create(createTicketDto, user, files);
  }


  @Get()
  @Auth(ValidRoles.ADMIN, ValidRoles.CLIENT)
  findAllFiltered(
    @Query() filterDto: GetTicketsFilterDto,
    @GetUser() user:User
  ) {
  return this.ticketService.findAllFiltered(filterDto, user);
  }

  @Get(':id')
  @Auth()
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.ticketService.findOne(id);
  }

  @Patch(':id')
  @Auth(ValidRoles.ADMIN, ValidRoles.AGENT)
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateTicketDto: UpdateTicketDto, @GetUser() user: User) {
    return this.ticketService.update(id, updateTicketDto, user);
  }

  @Delete(':id')
  @Auth(ValidRoles.ADMIN)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.ticketService.remove(id);
  }
}
