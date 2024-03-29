import { Test, TestingModule } from '@nestjs/testing';
import { TodosService } from './todos.service';
import { getModelToken } from '@nestjs/mongoose';
import { Todo } from './schema/todo.schema';
import { Model, Types } from 'mongoose';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { title } from 'process';

describe('TodosService', () => {
  const mockTodoService = {
    findOne: jest.fn(),
    find: jest.fn(),
    create: jest.fn(),
    updateOne: jest.fn(),
    deleteOne: jest.fn(),
  };

  const mockTodo = {
    _id: '60f4b4d5e9a3f5b6e8f3b3e6',
    title: 'test',
    body: 'test',
  };

  let service: TodosService;
  let model: Model<Todo>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TodosService, { provide: getModelToken(Todo.name), useValue: mockTodoService }],
    }).compile();

    service = module.get<TodosService>(TodosService);
    model = module.get<Model<Todo>>(getModelToken(Todo.name));
  });


  describe('findone', () => {
    it('It should return a todo by id', async () => {
      jest.spyOn(model, 'findOne').mockResolvedValue(mockTodo);

      const result = await service.findOne(mockTodo._id);

      expect(model.findOne).toHaveBeenCalledWith({ _id: mockTodo._id });
      expect(result).toEqual(mockTodo);
    });

    it('It should throw an BadRequestException if the id is invalid', async () => {
      const id = 'invalid-Id';

      const isValidObjectIDMock = jest.spyOn(Types.ObjectId, 'isValid').mockReturnValue(false);

      await expect(service.findOne(id)).rejects.toThrow(BadRequestException);
      expect(isValidObjectIDMock).toHaveBeenCalledWith(id);
      isValidObjectIDMock.mockRestore();
    });

    it('It should throw an NotFoundException if the todo not found', async () => {
      jest.spyOn(model, 'findOne').mockResolvedValue(null);

      await expect(service.findOne(mockTodo._id)).rejects.toThrow(NotFoundException);

      expect(model.findOne).toHaveBeenCalledWith({ _id: mockTodo._id });
    });
  });

  describe('findall', () => {
    it('It should retun array of Todos', async () => {
      const limit = 1;
      const skip = 0;

      jest.spyOn(model, 'find').mockImplementation(
        () => ({
          limit: () => ({
            skip: jest.fn().mockResolvedValue([mockTodo]),
          }),
        } as any),
      );

      const result = await service.findAll(limit, skip);
      expect(result).toEqual([mockTodo]);
    });
  });

  describe('create', () => {
    it('It should create Todo and return it', async () => {
      const newTodo = {
        title: 'test',
        body: 'test',
      };

      jest.spyOn(model, 'create').mockImplementationOnce(() => Promise.resolve(mockTodo) as any);
      const result = await service.create(newTodo as CreateTodoDto);
      expect(result).toEqual(mockTodo);
    });
  });

  describe('update', () => {

    it('It should throw an BadRequestException if the id is invalid', async () => {
      const id = 'invalid-Id';

      const isValidObjectIDMock = jest.spyOn(Types.ObjectId, 'isValid').mockReturnValue(false);

      await expect(service.findOne(id)).rejects.toThrow(BadRequestException);
      expect(isValidObjectIDMock).toHaveBeenCalledWith(id);
      isValidObjectIDMock.mockRestore();
    });

    it('It should update Todo by id', async () => {
      const updatedTodo = { ...mockTodo, title: "updated title" };
      const todo = { title: "updated title" }

      jest.spyOn(model, 'updateOne').mockResolvedValue(updatedTodo as any);

      await service.update(mockTodo._id, todo);
      expect(model.updateOne).toHaveBeenCalledWith({ _id: mockTodo._id }, todo);
    });
  });

  describe('remove', () => {
    it('It should delete Todo by id', async () => {
      jest.spyOn(model, 'deleteOne').mockResolvedValue(mockTodo as any);

      await service.remove(mockTodo._id);
      expect(model.deleteOne).toHaveBeenCalledWith({ _id: mockTodo._id });
    });

    it('It should throw an BadRequestException if the id is invalid', async () => {
      const id = 'invalid-Id';

      const isValidObjectIDMock = jest.spyOn(Types.ObjectId, 'isValid').mockReturnValue(false);

      await expect(service.findOne(id)).rejects.toThrow(BadRequestException);
      expect(isValidObjectIDMock).toHaveBeenCalledWith(id);
      isValidObjectIDMock.mockRestore();
    });
  });
});
