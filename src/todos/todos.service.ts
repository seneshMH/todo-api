import { Injectable, Logger } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Todo } from './schema/todo.schema';
import { Model } from 'mongoose';

@Injectable()
export class TodosService {
  private logger = new Logger(TodosService.name);

  constructor(@InjectModel(Todo.name) private todoModel: Model<Todo>) {}

  async create(createTodoDto: CreateTodoDto): Promise<Todo> {
    const createdTodo = new this.todoModel(createTodoDto);
    this.logger.log(`create todo with title: ${createTodoDto.title}`);
    return createdTodo.save();
  }

  async findAll(): Promise<Todo[]> {
    this.logger.log(`find all todos`);
    return this.todoModel.find().exec();
  }

  async findOne(id: string): Promise<Todo> {
    this.logger.log(`find todo with id: ${id}`);
    return this.todoModel.findOne({ _id: id }).exec();
  }

  async update(id: string, updateTodoDto: UpdateTodoDto) {
    this.todoModel.updateOne({ _id: id }, updateTodoDto).exec();
    this.logger.log(`Updated todo with id: ${id}`);
  }

  async remove(id: string) {
    this.todoModel.deleteOne({ _id: id }).exec();
    this.logger.log(`delete todo with id: ${id}`);
  }
}
