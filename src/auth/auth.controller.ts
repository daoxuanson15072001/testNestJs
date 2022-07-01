import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Request,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import AuthService from './auth.service';
import { User } from 'src/database/entity/user.entity';;
import { RegisterDTO } from 'src/DTO/register.dto';
import { LoginDto } from 'src/DTO/login.dto';
import { IToken } from 'src/types/token';
import { HttpExceptionFilter } from 'src/Exception/forbiddenException';
import { TransformInterceptor } from 'src/interceptor/transform.interceptor';
@Controller('auth')
export default class AuthController {
  constructor(
    private readonly authService: AuthService,
    private jwtService: JwtService,
  ) {}

  @Post('/login')
  async login(@Body() body : LoginDto) : Promise<IToken>{
      return this.authService.login(body);
  }

  @Post('/register')
  async register(@Body() body: RegisterDTO) : Promise<IToken> {
    return this.authService.register(body);
  }

  @Post()
  async refreshToken(@Body('refreshToken') refreshToken: string) : Promise<string> {
    return this.refreshToken(refreshToken);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/profile')
  async getProfile(@Request() req) {
    return this.authService.getProfile(req);
  }

  @Get('profile/:id')
  async findOne(@Param('id' , ParseIntPipe) id : number){
      return this.authService.getUserById(id);
  }


  @UseFilters(new HttpExceptionFilter())
  @Post('exception')
  async create(@Body() body : LoginDto){
      throw new NotFoundException();
  }

}
