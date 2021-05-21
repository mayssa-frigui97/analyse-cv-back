import {Resolver,Query,Args,Int} from '@nestjs/graphql';
import { AppService } from './app.service';

@Resolver((of) => String)
export class AppResolver {
  constructor(private appService: AppService) {}

    @Query((returns) => String)
  getHello():String {
    return this.appService.getHello();
  }
}
