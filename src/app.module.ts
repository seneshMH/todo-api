import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TodosModule } from './todos/todos.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    //ConfigModule.forRoot(),
    MongooseModule.forRoot('mongodb://0.0.0.0:27017/todo'),
    TodosModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
