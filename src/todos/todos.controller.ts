import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Req,
  Res,
  HttpStatus,
  ValidationPipe,
  NotFoundException,
  HttpException,
  Query,
} from '@nestjs/common';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Response } from 'express';
import { ApiQuery } from '@nestjs/swagger';
import { Types } from 'mongoose';

@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) { }

  @Post()
  create(@Body(ValidationPipe) createTodoDto: CreateTodoDto) {
    return this.todosService.create(createTodoDto);
  }

  @Get()
  @ApiQuery({ name: 'limit', required: true, type: Number })
  @ApiQuery({ name: 'skip', required: true, type: Number })
  async findAll(@Res() res: Response, @Query() { limit, skip }) {
    try {
      const todos = await this.todosService.findAll(limit, skip);
      res.status(HttpStatus.OK).send({ success: true, message: 'Todos found', data: todos });
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException(error.message, error.getStatus());
      }
      throw new NotFoundException('Todo not found');
    }
  }

  @Get(':id')
  async findOne(@Res() res: Response, @Param('id') id: string) {
    try {
      const todo = await this.todosService.findOne(id);
      res.status(HttpStatus.OK).send({ success: true, message: 'Todo found', data: todo });
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException(error.message, error.getStatus());
      }
      throw new NotFoundException('Todo not found');
    }
  }

  @Put(':id')
  async update(@Res() res: Response, @Param('id') id: string, @Body(ValidationPipe) updateTodoDto: UpdateTodoDto) {
    try {
      await this.todosService.update(id, updateTodoDto);
      res.status(HttpStatus.OK).send({ success: true, message: 'Todo updated' });
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException(error.message, error.getStatus());
      }
      throw new NotFoundException('Todo not found');
    }
  }

  @Delete(':id')
  async remove(@Res() res: Response, @Param('id') id: string) {
    try {
      await this.todosService.remove(id);
      res.status(HttpStatus.OK).send({ success: true, message: 'Todo deleted' });
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException(error.message, error.getStatus());
      }
      throw new NotFoundException('Todo not found');
    }
  }
}
