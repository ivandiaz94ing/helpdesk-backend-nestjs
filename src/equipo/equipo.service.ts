import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Equipo } from './entities/equipo.entity';
import { UpdateEquipoDto } from './dto/update-equipo.dto';
import { CreateEquipoDto } from './dto/create-equipo.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class EquipoService {
  constructor(
    @InjectRepository(Equipo)
    private readonly equipoRepository: Repository<Equipo>,
    private readonly userService: UserService,
  ) {}

  async create(createEquipoDto: CreateEquipoDto) {
    //separamos el string del ID del resto de los datos
    const { usuarioResponsableId, ...equipoData } = createEquipoDto;
    //Buscamos el usuario responsable por su ID
    const usuario =  await this.userService.findOne(usuarioResponsableId);
    //Armamos el equipo, asignandole el objeto usuario completo
    try {

      const nuevoEquipo = this.equipoRepository.create({
        ...equipoData,
        user: usuario,
      });

      return await this.equipoRepository.save(nuevoEquipo);
    } catch (error) {
      this.handleError(error);
    }
  }

  private handleError(error: any): never {
    if (error.code === '23505') {
      throw new NotFoundException('Ya existe un equipo con ese número de serie');
    }
    console.log(error);
    throw new InternalServerErrorException('Error al crear el equipo');
  }

  findAll() {
    return this.equipoRepository.find({ where: { isActive: true } });
  }

  async findOne(id: string) {
    const equipo = await this.equipoRepository.findOneBy({ id });
    if (!equipo) {
      throw new NotFoundException(
        `El equipo con el id ${id} no fue encontrado`,
      );
    }
    return equipo;
  }

  update(id: number, updateEquipoDto: UpdateEquipoDto) {
    return `This action updates a #${id} equipo`;
  }

  async remove(id: string) {
    const equipo = await this.findOne(id);

    if (equipo.isActive === false) {
      throw new NotFoundException(
        `El equipo con el id ${id} ya fue eliminado anteriormente`,
      );
    }

    equipo.isActive = false;
    await this.equipoRepository.save(equipo);

    return {
      message: `El equipo con el id ${id} ha sido dado de baja exitosamente`,
    };
  }
}