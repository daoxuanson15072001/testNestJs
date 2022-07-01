import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from 'src/database/entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { RegisterDTO } from 'src/DTO/register.dto';
import { JwtService } from '@nestjs/jwt';
import { IToken } from 'src/types/token';
import config from '../config';
import { Exception } from 'src/Exception/exception';
import { ErrorCode } from 'src/types/exception.enum';
@Injectable()
export default class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}
  //Login
  async login({ email, password }): Promise<IToken> {
    const user = await this.userRepository.findOne({
      where: { email },
      select: ['id', 'password' , 'email'],
    });
    if (!user) {
      throw new Exception(ErrorCode.Email_Or_Password_Not_valid, 'email does not exist' , 400 , email);
    }
    if (!(await bcrypt.compare(password, user.password)))
      throw new Error('user or password incorrect');
    return this.generateToken(this.userRepository , user);
  }

  //register
  async register(user: RegisterDTO) : Promise<IToken>{
    if(await this.userRepository.findOne({where : {email : user.email}})){
        throw new Exception(ErrorCode.Email_Already_Exist , 'email already exist');
    }
    const newUser = await this.userRepository.save({
      email: user.email,
      password: await bcrypt.hash(user.password, 10),
      firstName: user.firstName,
      lastName: user.lastName,
    });
    return this.generateToken(this.userRepository , newUser);
  }
  //refresh token
  async refreshToken(refreshToken : string) : Promise<string>{
      const payload = await this.jwtService.verify(refreshToken , {secret : config.AUTH.JWT_REFRESH_TOKEN_KEY});
      if(!payload) throw new UnauthorizedException('you have provided invalid refresh token');
      const user = await this.userRepository.findOne({
        where : {id : payload.id},
        select : ['id' , 'email' , 'refreshToken']
      });
      if (refreshToken !== user.refreshToken) throw new UnauthorizedException('Your refresh token changed, please login again');
      const result = await this.generateToken(this.userRepository , user);
      return result?.token;
  }

  //getProfile
  async getProfile(req): Promise<User> {
    const user = this.userRepository.findOne({where : {id : req.user.id}});
    return user;
  }

  async getUserById(id : number){
    const user = this.userRepository.findOne({where : {id : id}});
    return user;
  }
  async generateToken(
    userRepository: Repository<User>,
    user: User,
  ): Promise<IToken> {
    const payload = { id: user.id, email: user.email };
    const token = await this.jwtService.sign(
      { ...payload },
      {
        secret: config.AUTH.JWT_SECRET_KEY,
        expiresIn: config.AUTH.JWT_SECRET_KEY_EXPIRESIN,
      },
    );
    const refreshToken = await this.jwtService.sign(
      { ...payload },
      {
        secret: config.AUTH.JWT_REFRESH_TOKEN_KEY,
        expiresIn: config.AUTH.JWT_REFRESH_TOKEN_KEY_EXPIRESIN,
      },
    );
    if(refreshToken){
      userRepository.update(user.id , {refreshToken : refreshToken});
    }
    return {token , refreshToken};
  }
}
