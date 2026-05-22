import { Injectable } from '@nestjs/common';


// padrão criacional Singleton: o NestJS trata as classe com @Injectable() como Singleton
// instancia o AppService apenas uma vez e reutilizará em toda a aplicação sempre que for requisitada
@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
