import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Res,
  HttpStatus,
  ValidationPipe,
  NotFoundException,
  HttpException,
  Query,
  BadRequestException,
  DefaultValuePipe,
} from '@nestjs/common';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Response } from 'express';
import { ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('todos')
@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) { }

  @Post()
  async create(@Res() res: Response, @Body(ValidationPipe) createTodoDto: CreateTodoDto) {
    try {
      const todo = await this.todosService.create(createTodoDto);
      res.status(HttpStatus.CREATED).send({ success: true, message: 'Todo created', data: todo });
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException(error.message, error.getStatus());
      }
      throw new BadRequestException('Todo creation failed');
    }
  }

  @Get()
  @ApiQuery({ name: 'limit', required: true, type: Number })
  @ApiQuery({ name: 'skip', required: true, type: Number })
  async findAll(@Res() res: Response, @Query('limit', new DefaultValuePipe(10)) limit: number, @Query('skip', new DefaultValuePipe(0)) skip: number) {
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
