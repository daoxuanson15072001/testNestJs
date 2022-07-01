import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import AuthService from './auth.service';
import AuthController from './auth.controller';
import { User } from 'src/database/entity/user.entity';
import { LocalStrategy } from './local.strategy';
import { PassportModule } from '@nestjs/passport';
import  config  from '../config';
import { JwtStrategy } from './jwt.strategy';
import { JwtService } from '@nestjs/jwt';
@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule,
  ],
  providers: [AuthService, LocalStrategy , JwtStrategy , JwtService],
  controllers: [AuthController],
})
export class AuthModule {}
