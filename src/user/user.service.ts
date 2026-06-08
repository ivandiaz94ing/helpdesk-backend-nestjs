import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload.interface';

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
    try {
      const {password, ...userData} = createUserDto;

      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10)
      });

      await this.userRepository.save(user); 
      return {
        user,
        token: this.getJwtToken({ id: user.id })
      };
    } catch (error) {
      this.handleError(error);
    }
  }
  
  async updateUserRole(id: string) {
    console.log('Implementando metodo de actualizacion de usuario');
    return {
      message: `User with id ${id} has been updated`
    };
  } 

  async findOne(id: string) {
    const user = await this.userRepository.findOneBy({ id });
    
    if (!user) {
      throw new NotFoundException(`El usuario con el id ${id} no fue encontrado`);
    }
    
    return user;
  }

  async remove(id: string) {
    // 1. Verificamos que el usuario exista
    const user = await this.findOne(id);

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
        email: true, 
        password: true,
        id: true  
      }
    });

    if (!user) 
      throw new BadRequestException('Credentials are not valid');
    
    if (!bcrypt.compareSync(password, user.password))
      throw new BadRequestException('Credentials are not valid');

    return {
      id: user.id,
      token: this.getJwtToken({ id: user.id })};
  }

  async checkAuthStatus(user: User) {
    return {
      ...user,
      token: this.getJwtToken({ id: user.id })
    }
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

  }
