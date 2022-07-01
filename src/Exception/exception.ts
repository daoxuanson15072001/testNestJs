import { ErrorCode } from 'src/types/exception.enum';
import { HttpException, HttpStatus } from '@nestjs/common';

export class CustomExceptionFactory extends HttpException {
  constructor(errorCode: ErrorCode, devMessage?: string | any, statusCode?: HttpStatus, payload?: any) {
    const errorObject = { errorCode, statusCode: statusCode || HttpStatus.BAD_REQUEST };

    if (devMessage) errorObject['devMessage'] = devMessage;
    if (payload) errorObject['payload'] = payload;

    super(errorObject, errorObject.statusCode);
  }
}
export class Exception extends CustomExceptionFactory {
    constructor(errorCode: ErrorCode, devMessage?: string | any, statusCode?: HttpStatus, payload?: any) {
      super(errorCode, devMessage, statusCode, payload);
    }
  }
  

