import { Controller, Get, Post, Body, UseGuards, Patch, Param } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { GetUser } from './decorators/get-user-decorator';
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
  @Auth(ValidRoles.CLIENT)
  findAllUsers() {
    return this.userService.findAllUsers();
  }

  @Patch(':id')
  @Auth(ValidRoles.ADMIN)
  updateUserRole(@Param('id') id: string) {
      return this.userService.updateUserRole(id);
  }

}
