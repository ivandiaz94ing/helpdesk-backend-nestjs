import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEquipoDto } from './dto/create-equipo.dto';
import { UpdateEquipoDto } from './dto/update-equipo.dto';
import { Repository } from 'typeorm';
import { Equipo } from './entities/equipo.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class EquipoService {

  constructor(
    @InjectRepository(Equipo)
    private readonly equipoRepository: Repository<Equipo>
  ){}


  create(createEquipoDto: CreateEquipoDto) {
    return 'This action adds a new equipo';
  }

  findAll() {
    return this.equipoRepository.find({where: {isActive: true}});
  }

  async findOne(id: string) {
    const equipo = await this.equipoRepository.findOneBy({ id });
    if (!equipo) {
      throw new NotFoundException(`El equipo con el id ${id} no fue encontrado`);
    }
    return equipo;
  }

  update(id: number, updateEquipoDto: UpdateEquipoDto) {
    return `This action updates a #${id} equipo`;
  }

  async remove(id: string) {
    const equipo = await this.findOne(id);

    if (equipo.isActive === false) {
      throw new NotFoundException(`El equipo con el id ${id} ya fue eliminado anteriormente`);
    }

    equipo.isActive = false;
    await this.equipoRepository.save(equipo);

    return {
      message: `El equipo con el id ${id} ha sido dado de baja exitosamente`
    };
  }
}