import { PartialType } from '@nestjs/mapped-types';
import { CreateTicketDto } from './create-ticket.dto';
import { IsEnum, IsOptional, IsUUID } from 'class-validator';
import { TicketStatus } from '../enums';

export class UpdateTicketDto extends PartialType(CreateTicketDto) {
    @IsOptional()
    @IsUUID()
    tecnicoId?: string;

    @IsOptional()
    @IsEnum(TicketStatus, { message: `status must be one of the following values: ${Object. values(TicketStatus).join(', ')}` }) 
    status?:TicketStatus;
}
