import { IsEnum, IsOptional, IsUUID, IsInt, Min } from "class-validator";
import { Type } from "class-transformer";
import { TicketPriority, TicketStatus } from "../enums";


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

    //NUEVOS CAMPOS PARA PAGINACION

    @IsOptional()
    @IsInt()
    @Min(1)
    @Type(() => Number) // Transforma el string de la URL a un Número
    limit?: number = 10; // 10 tickets por defecto

    @IsOptional()
    @IsInt()
    @Min(0)
    @Type(() => Number)
    offset?: number=0; //Inicia desde el primer ticket por defecto
}