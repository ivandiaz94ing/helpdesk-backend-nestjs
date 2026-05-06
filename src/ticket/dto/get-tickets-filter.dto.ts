import { IsEnum, IsOptional, IsUUID } from "class-validator";
import { TicketPriority } from "../enums/ticket-priority.enum";
import { TicketStatus } from "../enums/ticket-status.enum";

export class GetTicketsFilterDto {
    @IsOptional()
    @IsEnum(TicketPriority, {
        message: 'La prioridad debe ser baja, media o alta',
    })
    priority?: TicketPriority;

    @IsOptional()
    @IsEnum(TicketStatus,{
        message: 'El estado debe ser abierto, en proceso o cerrado',
    })
    status?: TicketStatus;

    @IsOptional()
    @IsUUID()
    userId?: string;
}