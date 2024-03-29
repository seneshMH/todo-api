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

  //create Todo
  async create(createTodoDto: CreateTodoDto): Promise<Todo> {
    const createdTodo = await this.todoModel.create(createTodoDto);
    this.logger.log(`create todo with title: ${createTodoDto.title}`);
    return createdTodo;
  }

  //findall Todo with limit and skip
  async findAll(limit: number, skip: number): Promise<Todo[]> {
    const todos = await this.todoModel.find().limit(limit).skip(skip);
    this.logger.log(`find all todos`);
    return todos;
  }

  //findone Todo by id
  async findOne(id: string): Promise<Todo> {
    const idIsValid = Types.ObjectId.isValid(id);
    if (!idIsValid) {
      throw new BadRequestException("Invalid id !");
    }
    const todo = await this.todoModel.findOne({ _id: id });
    this.logger.log(todo);
    if (!todo) {
      throw new NotFoundException("Todo not found !");
    }
    this.logger.log(`find todo with id: ${id}`);

    return todo;
  }

  //update Todo by id
  async update(id: string, updateTodoDto: UpdateTodoDto) {
    const idIsValid = Types.ObjectId.isValid(id);
    if (!idIsValid) {
      throw new BadRequestException("Invalid id !");
    }

    await this.todoModel.updateOne({ _id: id }, updateTodoDto);

    this.logger.log(`Updated todo with id: ${id}`);
  }

  //remove Todo by id
  async remove(id: string) {
    const idIsValid = Types.ObjectId.isValid(id);
    if (!idIsValid) {
      throw new BadRequestException("Invalid id !");
    }
    await this.todoModel.deleteOne({ _id: id });

    this.logger.log(`delete todo with id: ${id}`);
  }
}
