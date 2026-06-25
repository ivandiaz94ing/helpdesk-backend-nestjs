import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsOptional, IsString, IsUUID, MinLength } from "class-validator";

export class CreateEquipoDto {
    @ApiProperty({ description: 'Nombre del equipo', example: 'Laptop HP ProBook' })
    @IsString()
    @MinLength(3)
    @IsNotEmpty()
    nombre: string;

    @ApiProperty({ description: 'Modelo del equipo', example: '440 G8' })
    @IsString()
    @MinLength(2)
    @IsNotEmpty()
    modelo: string;

    @ApiProperty({ description: 'Marca del equipo', example: 'HP' })
    @IsString()
    @IsNotEmpty()
    marca: string;

    @ApiProperty({ description: 'Número de serie único del equipo', example: 'MXL1234567' })
    @IsString()
    @IsNotEmpty()
    @MinLength(5)
    numeroSerie: string;
    
    @ApiProperty({ description: 'ID del usuario/funcionario asignado al equipo', example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' })
    @IsUUID()
    @IsNotEmpty()
    usuarioResponsableId: string;

    @ApiPropertyOptional({ description: 'Estado del equipo', default: true })
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
    
}
