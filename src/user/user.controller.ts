import { Controller, Get, Post, Body, UseGuards, Patch, Param } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { GetUser } from './decorators/get-user-decorator';
import { GetRowHeaders } from './decorators/get-rowHeader-decorator';
import { UserRoleGuard } from './guards/user-role.guard';
import { RoleProtected } from './decorators/role-protected.decorator';
import { Auth } from './decorators/auth-decorator';
import { User } from './entities/user.entity';
import { ValidRoles } from './interfaces/validRoles';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }
  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.userService.login(loginUserDto);
  }

  @Get('check-status')
  @Auth()
  checkAuthStatus(
    @GetUser() user: User,
  ){
    return this.userService.checkAuthStatus(user);
  } 
  
  @Get()
  @Auth(ValidRoles.ADMIN)
  findAllUsers() {
    return this.userService.findAllUsers();
  }

  @Patch(':id')
  @Auth(ValidRoles.ADMIN)
  updateUserRole(@Param('id') id: string) {
      return this.userService.updateUserRole(id);
  }

  @Get('private')
  @UseGuards(AuthGuard())
  testingPrivateRoute(
    @GetUser() user: User,
    @GetUser('email') userEmail: string,
    @GetRowHeaders() rowHeaders: string[]
  ){
    return{
      ok: true,
      message: 'This is a private route',
      user,
      userEmail,
      rowHeaders
      
    }

  }
  // @SetMetadata('roles', ['admin', 'agent'])

  @Get('private2')
  @RoleProtected(ValidRoles.CLIENT)
  @UseGuards(AuthGuard(), UserRoleGuard)
  privateRoute2(
    @GetUser() user: User,
  ){
    return{
      ok: true,
      // message: 'Agregar este guard a la ruta de consultar todos los tickets',
      message: 'Los admin son los unicos que pueden acceder a la ruta de consultar usuarios y actualizar roles',
      user,
    }
  }

  @Get('private3')
  @Auth(ValidRoles.ADMIN)
  privateRoute3(
    @GetUser() user: User,
  ){
    return{
      ok: true,
      message: 'hola',
      user,
    }

  }
}
