import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { TodoService } from './todo.service';
import { TodoCreateInput, TodoUpdateInput } from './todo.model';
import { createPaginationResponse } from '../../utils/pagination';

export class TodoController {
  private todoService: TodoService;

  constructor(fastify: FastifyInstance) {
    this.todoService = new TodoService(fastify);
  }

  async getAllTodos(
    request: FastifyRequest<{
      Querystring: { limit?: string; offset?: string };
    }>,
    reply: FastifyReply
  ) {
    try {
      const limit = parseInt(request.query.limit as string) || 10;
      const offset = parseInt(request.query.offset as string) || 0;

      const { todos, total } = await this.todoService.findAll(limit, offset);

      const response = createPaginationResponse(todos, total, limit, offset);

      return reply.send(response);
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({ error: 'Internal Server Error' });
    }
  }

  async getTodoById(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    try {
      const id = parseInt(request.params.id);

      if (isNaN(id)) {
        return reply.status(400).send({ error: 'Invalid ID format' });
      }

      const todo = await this.todoService.findById(id);

      if (!todo) {
        return reply.status(404).send({ error: 'Todo not found' });
      }

      return reply.send(todo);
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({ error: 'Internal Server Error' });
    }
  }

  async createTodo(
    request: FastifyRequest<{ Body: TodoCreateInput }>,
    reply: FastifyReply
  ) {
    try {
      const todo = await this.todoService.create(request.body);
      return reply.status(201).send(todo);
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({ error: 'Internal Server Error' });
    }
  }

  async updateTodo(
    request: FastifyRequest<{
      Params: { id: string };
      Body: TodoUpdateInput;
    }>,
    reply: FastifyReply
  ) {
    try {
      const id = parseInt(request.params.id);

      if (isNaN(id)) {
        return reply.status(400).send({ error: 'Invalid ID format' });
      }

      const todo = await this.todoService.update(id, request.body);

      if (!todo) {
        return reply.status(404).send({ error: 'Todo not found' });
      }

      return reply.send(todo);
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({ error: 'Internal Server Error' });
    }
  }

  async deleteTodo(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    try {
      const id = parseInt(request.params.id);

      if (isNaN(id)) {
        return reply.status(400).send({ error: 'Invalid ID format' });
      }

      const success = await this.todoService.delete(id);

      if (!success) {
        return reply.status(404).send({ error: 'Todo not found' });
      }

      return reply.status(204).send();
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({ error: 'Internal Server Error' });
    }
  }
}
