import { Module } from '@nestjs/common';
import { EquipoService } from './equipo.service';
import { EquipoController } from './equipo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Equipo } from './entities/equipo.entity';
import { UserModule } from 'src/user/user.module';

@Module({
  controllers: [EquipoController],
  providers: [EquipoService],
  imports: [
    TypeOrmModule.forFeature([
      Equipo
    ]),
    UserModule,
  ]
})
export class EquipoModule {}
