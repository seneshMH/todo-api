import { Test, TestingModule } from '@nestjs/testing';
import { TodosController } from './todos.controller';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { UpdateTodoDto } from './dto/update-todo.dto';

describe('TodosController', () => {
    let controller: TodosController;
    let service: TodosService;

    const mockTodo = {
        _id: '60f4b4d5e9a3f5b6e8f3b3e6',
        title: 'test',
        body: 'test',
    };

    const mockTodoService = {
        create: jest.fn(),
        findAll: jest.fn(),
        findOne: jest.fn(),
        update: jest.fn(),
        remove: jest.fn(),
    };

    const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [TodosController],
            providers: [TodosService, { provide: TodosService, useValue: mockTodoService }],
        }).compile();

        controller = module.get<TodosController>(TodosController);
        service = module.get<TodosService>(TodosService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('create', () => {
        it('should create a todo', async () => {
            const createTodoDto: CreateTodoDto = mockTodo;
            const createdTodo = { _id: '1', ...createTodoDto };
            jest.spyOn(service, 'create').mockResolvedValue(createdTodo);

            await controller.create(res as any, createTodoDto);

            expect(res.status).toHaveBeenCalledWith(HttpStatus.CREATED);
            expect(res.send).toHaveBeenCalledWith({ success: true, message: 'Todo created', data: createdTodo });
        });

        it('should handle error during todo creation', async () => {
            const createTodoDto: CreateTodoDto = mockTodo;
            jest.spyOn(service, 'create').mockRejectedValue(new HttpException('Test Error', HttpStatus.BAD_REQUEST));

            await expect(controller.create({} as any, createTodoDto)).rejects.toThrow(HttpException);
        });
    });

    describe('findAll', () => {
        it('should return array of todos', async () => {
            const todos = [mockTodo];
            jest.spyOn(service, 'findAll').mockResolvedValue(todos);

            await controller.findAll(res as any, 10, 0);

            expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
            expect(res.send).toHaveBeenCalledWith({ success: true, message: 'Todos found', data: todos });
        });

        it('should handle error when fetching todos', async () => {
            jest.spyOn(service, 'findAll').mockRejectedValue(new HttpException('Test Error', HttpStatus.NOT_FOUND));

            await expect(controller.findAll({} as any, 10, 0)).rejects.toThrow(HttpException);
        });
    });

    describe('findOne', () => {
        it('should return a todo', async () => {

            jest.spyOn(service, 'findOne').mockResolvedValue(mockTodo);

            await controller.findOne(res as any, '1');

            expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
            expect(res.send).toHaveBeenCalledWith({ success: true, message: 'Todo found', data: mockTodo });
        });

        it('should handle error when todo is not found', async () => {
            jest.spyOn(service, 'findOne').mockRejectedValue(new HttpException('Todo not found', HttpStatus.NOT_FOUND));

            await expect(controller.findOne({} as any, '1')).rejects.toThrow(HttpException);
        });
    });

    describe('update', () => {
        it('should update a todo', async () => {
            const updateTodoDto: UpdateTodoDto = { ...mockTodo, title: 'Updated Title' };
            const todoId = '1';
            jest.spyOn(service, 'update').mockResolvedValue(null);

            await controller.update(res as any, todoId, updateTodoDto);

            expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
            expect(res.send).toHaveBeenCalledWith({ success: true, message: 'Todo updated' });
        });

        it('should handle error when updating a todo', async () => {
            const updateTodoDto: UpdateTodoDto = { ...mockTodo, title: 'Updated Title' };;
            const todoId = '1';
            jest.spyOn(service, 'update').mockRejectedValue(new HttpException('Todo not found', HttpStatus.NOT_FOUND));

            await expect(controller.update({} as any, todoId, updateTodoDto)).rejects.toThrow(HttpException);
        });
    });

    describe('remove', () => {
        it('should delete a todo', async () => {
            const todoId = '1';
            jest.spyOn(service, 'remove').mockResolvedValue(null);

            await controller.remove(res as any, todoId);

            expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
            expect(res.send).toHaveBeenCalledWith({ success: true, message: 'Todo deleted' });
        });

        it('should handle error when deleting a todo', async () => {
            const todoId = '1';
            jest.spyOn(service, 'remove').mockRejectedValue(new HttpException('Todo not found', HttpStatus.NOT_FOUND));

            await expect(controller.remove({} as any, todoId)).rejects.toThrow(HttpException);
        });
    });
});
