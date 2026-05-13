import { HttpException } from '@nestjs/common';

export class AppException extends HttpException {
  constructor(
    message: string,
    public readonly code: string,
    status: number,
  ) {
    super({ message, code }, status);
  }
}
