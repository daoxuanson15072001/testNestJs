import * as dotenv from 'dotenv';
dotenv.config();
export default {
    AUTH : {
        JWT_SECRET_KEY : process.env.SECRET_KEY,
        JWT_REFRESH_TOKEN_KEY : process.env.REFRESH_TOKEN_KEY,
        JWT_SECRET_KEY_EXPIRESIN : '60s',
        JWT_REFRESH_TOKEN_KEY_EXPIRESIN : '2h'
        
    }
}