import { Injectable } from '@nestjs/common';

@Injectable()
export class FooService {
  findAll() {
    return {
      success: true,
    };
  }
}
