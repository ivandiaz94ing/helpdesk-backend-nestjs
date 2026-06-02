import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
// import passport from 'passport';

@Module({
  controllers: [UserController],
  providers: [UserService, JwtStrategy],
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([User]),
    PassportModule.register({ defaultStrategy: 'jwt' }),

    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],

      useFactory: (configService: ConfigService) => {
      // console.log('JWT SECRET', process.env.JWT_SECRET);
      // console.log('JWT SECRET', configService.get('JWT_SECRET'));
      return {
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '1h' }  
      }
    }

    }),
  ],
  exports: [TypeOrmModule, PassportModule, JwtModule, JwtStrategy],
})
export class UserModule {}
