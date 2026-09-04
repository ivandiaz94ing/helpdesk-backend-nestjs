import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { User } from './entities/user.entity';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { CreateUserAdminDto } from './dto/create-user-admin';

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService
  ){}

  async findAllUsers() {
    return await this.userRepository.find({
      where: { isActive: true },
    });
  }

  async create(createUserDto: CreateUserDto) {
    return this.createUserInternal(createUserDto, true);
  }

  //Registro de usario como administrador
  async createAdminUser(createUserAdminDto: CreateUserAdminDto) {
    return this.createUserInternal(createUserAdminDto, false );
  }
  
  async update(id: string, updateUserDto: UpdateUserDto) {
    // 1. Buscamos el usuario con tu método que ya lanza el 404
    const user = await this.findOne(id);
    
    // Retorno temprano si no hay campos en el DTO
    if (!updateUserDto || Object.keys(updateUserDto).length === 0) {
      return user;
    }

    try {
      // 2. 🛡️ SEGURIDAD: Si viene una contraseña, la encriptamos ANTES de fusionar
      if (updateUserDto.password) {
        updateUserDto.password = bcrypt.hashSync(updateUserDto.password, 10);
      }

      this.userRepository.merge(user, updateUserDto);
      this.userRepository.save(user);

      delete user.password;
      return user;
    } catch (error) {
      this.handleError(error);
    }
  }
  
  async resetPasswordAdmin(id: string) {

    // 1. Buscamos el usuario con tu método que ya lanza el 404
    const user = await this.findOne(id);

    if (!user) {
      throw new NotFoundException(`El usuario con el id ${id} no fue encontrado`);
    }
    // 2. Generamos la contraseña segura (Cumple con tu Regex: Mayúscula, minúsculas, números)
    const newPassword = 'Telematica123';

    // 3. Encriptamos y guardamos los cambios
    user.password = bcrypt.hashSync(newPassword, 10);
    await this.userRepository.save(user);

    // 4. MUY IMPORTANTE: Borramos la contraseña del objeto en memoria para que no viaje a Angular
    delete user.password;

    // 5. Retornamos el usuario limpio y un mensaje de éxito                                     
    return {                                                                                     
      message: 'Contraseña restablecida correctamente',                                          
      user                                                                                       
    };
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOneBy({ id:id });
    
    if (!user) {
      throw new NotFoundException(`El usuario con el id ${id} no fue encontrado`);
    }

    
    return user;
  }

  async remove(id: string) {
    // 1. Verificamos que el usuario exista
    const user = await this.findOne(id);
    
    if (user.isActive === false) {
      throw new BadRequestException(`Usuario ${user.fullname} no fué encontrado`);
    }

    // 2. Le cambiamos el estado a inactivo
    user.isActive = false;

    // 3. Guardamos los cambios
    await this.userRepository.save(user);

    // 4. Retornamos el mensaje de confirmación
    return {
      message: `El usuario ${user.fullname} ha sido de baja exitosamente`
    };
  }

  async login( loginUserDto: LoginUserDto ) {
    const { email, password } = loginUserDto;
    const user =  await this.userRepository.findOne({ 
      where: { email }, 
      select: { 
        id: true,  
        password: true,
        email: true,
        fullname: true,
        role: true,
        isActive: true
      }
    });

    if (!user) 
      throw new BadRequestException('Credentials are not valid');
    if (!user.isActive)
      throw new BadRequestException('User is inactive');
    
    if (!user.password || !bcrypt.compareSync(password, user.password))
      throw new BadRequestException('Credentials are not valid');
    delete user.password;

    return {
      user: user,
      token: this.getJwtToken({ id: user.id }),
    }

  }

  async checkAuthStatus(user: User) {
    return {
      user: user,
      token: this.getJwtToken({ id: user.id })
    }
  }

  async changePassword(userId: string, changePasswordDto: ChangePasswordDto) {
    const { oldPassword, newPassword } = changePasswordDto;

    // Buscamos al usuario incluyendo su password (ya que tiene select: false)
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: {
        id: true,
        password: true,
        email: true,
        fullname: true,
        role: true,
        isActive: true
      }
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Validar contraseña actual
    if (!user.password || !bcrypt.compareSync(oldPassword, user.password)) {
      throw new BadRequestException('La contraseña actual es incorrecta');
    }

    // Encriptar y guardar nueva contraseña
    user.password = bcrypt.hashSync(newPassword, 10);
    await this.userRepository.save(user);

    delete user.password;
    return {
      message: 'Contraseña actualizada correctamente',
      user
    };
  }

  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }

  private handleError(error: any){
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }
      console.log(error);
      throw new InternalServerErrorException('Please check server logs'); 
    
  }

  private async createUserInternal(userDataToCreate: CreateUserDto | CreateUserAdminDto, generaToken: boolean) {
    try {
      const { password, ...userData } = userDataToCreate;

      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10)
      });
      await this.userRepository.save(user);
      delete user.password;
      if(!generaToken) {
      return {
        user,
      };
    }
    // Si no se especifica un rol, se asume que es un usuario normal
    return {
        user,
        token: this.getJwtToken({ id: user.id })
      };
    }
    catch (error) {
      this.handleError(error);
    }
  }
  }
