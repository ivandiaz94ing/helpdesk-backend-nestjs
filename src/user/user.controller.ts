import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from './user.service';
import { LoginUserDto } from './dto/login-user.dto';
import { GetUser } from './decorators/get-user-decorator';
import { UserRoleGuard } from './guards/user-role.guard';
import { RoleProtected } from './decorators/role-protected.decorator';
import { Auth } from './decorators/auth-decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { ValidRoles } from './interfaces/validRoles';
import { UpdateUserDto } from './dto/update-user.dto';

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
  checkAuthStatus(@GetUser() user: User) {
    return this.userService.checkAuthStatus(user);
  }

  // 1. Endpoint para el propio usuario (Angular lo usará para pintar el Header/Perfil)
  @Get('profile')
  @Auth() // 🛡️ Protegido: Solo exige que haya un Token válido (cualquier rol)
  getProfile(@GetUser('id') userId: string) {
    // Usamos el ID que viene oculto y seguro dentro del Token JWT
    // y reutilizamos tu método findOne para traer los datos frescos de la BD
    return this.userService.findOne(userId);
  }

  // 2. Endpoint para ver cualquier usuario por su ID (Para la vista de Administrador)
  @Get(':id')
  @Auth(ValidRoles.ADMIN) // 🛡️ Protegido: Solo administradores
  getUserById(@Param('id', ParseUUIDPipe) id: string) {
    // Reutilizamos la validación UUID que aprendimos y el mismo método del servicio
    return this.userService.findOne(id);
  }

  @Get()
  @Auth(ValidRoles.CLIENT)
  findAllUsers() {
    return this.userService.findAllUsers();
  }

  @Patch(':id')
  @Auth(ValidRoles.ADMIN)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Auth(ValidRoles.ADMIN)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.remove(id);
  }
}
