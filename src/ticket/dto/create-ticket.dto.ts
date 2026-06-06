import { IsEnum, IsString, MaxLength, MinLength } from "class-validator";
import { TicketPriority } from "../enums/ticket-priority.enum";
import { TicketStatus } from "../enums/ticket-status.enum";

export class CreateTicketDto {
    @IsString()
    @MaxLength(100)
    @MinLength(5)
    title: string;
    
    @IsString()
    @MinLength(5)
    description: string;
    
    @IsEnum(TicketPriority, { message: `priority must be one of the following values: ${Object.values(TicketPriority).join(', ')}` })
    priority: TicketPriority;

    @IsEnum(TicketStatus, { message: `status must be one of the following values: ${Object.values(TicketStatus).join(', ')}` })
    status: TicketStatus;

}
