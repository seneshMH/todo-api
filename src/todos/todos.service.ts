import { BadRequestException, HttpStatus, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Todo } from './schema/todo.schema';
import { Model, Types } from 'mongoose';

@Injectable()
export class TodosService {
  private logger = new Logger(TodosService.name);

  constructor(@InjectModel(Todo.name) private todoModel: Model<Todo>) { }

  async create(createTodoDto: CreateTodoDto): Promise<Todo> {
    const createdTodo = new this.todoModel(createTodoDto);
    this.logger.log(`create todo with title: ${createTodoDto.title}`);
    const todo = await createdTodo.save();
    if (!todo) {
      throw new BadRequestException('Todo not created');
    }
    return todo;
  }

  async findAll(limit: number, skip: number): Promise<Todo[]> {
    const todos = await this.todoModel.find().limit(limit).skip(skip).exec();
    this.logger.log(`find all todos`);
    return todos;
  }

  async findOne(id: string): Promise<Todo> {
    const idIsValid = Types.ObjectId.isValid(id);
    if (!idIsValid) {
      throw new BadRequestException("Invalid id !");
    }
    const todo = await this.todoModel.findOne({ _id: id }).exec();
    this.logger.log(todo);
    if (!todo) {
      throw new NotFoundException("Todo not found !");
    }
    this.logger.log(`find todo with id: ${id}`);

    return todo;
  }

  async update(id: string, updateTodoDto: UpdateTodoDto) {
    const idIsValid = Types.ObjectId.isValid(id);
    if (!idIsValid) {
      throw new BadRequestException("Invalid id !");
    }
    const todo = await this.todoModel.updateOne({ _id: id }, updateTodoDto).exec();
    if (todo.modifiedCount === 0) {
      throw new Error("Todo not found !");
    }
    this.logger.log(`Updated todo with id: ${id}`);
  }

  async remove(id: string) {
    const idIsValid = Types.ObjectId.isValid(id);
    if (!idIsValid) {
      throw new BadRequestException("Invalid id !");
    }
    const todo = await this.todoModel.deleteOne({ _id: id }).exec();
    if (todo.deletedCount === 0) {
      throw new Error("Todo not found !");
    }
    this.logger.log(`delete todo with id: ${id}`);
  }
}
