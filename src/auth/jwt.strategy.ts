import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import config from '../config'
import { Strategy, ExtractJwt } from 'passport-jwt';
import AuthService from './auth.service';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService : AuthService) {
    super({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        ignoreExpiration: false,
        secretOrKey: config.AUTH.JWT_SECRET_KEY
    });
  }
  async validate(payload : any) {    
    return { id : payload.id , email : payload.email};
  }
}
