import { IsEnum, IsString, IsUUID, MaxLength, MinLength } from "class-validator";
import { TicketCategory, TicketPriority, TicketStatus } from "../enums";


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

    @IsEnum(TicketCategory, { message: `category must be one of the following values: ${Object.values(TicketCategory).join(', ')}` })
    category: TicketCategory;

    @IsUUID()
    equipoId: string

  

}
