import { Injectable } from '@nestjs/common';

@Injectable()
export class BarService {
  findAll() {
    return {
      success: true,
    };
  }
}
