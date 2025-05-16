import { FastifyInstance } from 'fastify';
import { TodoController } from './todo.controller';
import { TodoCreateInput, TodoUpdateInput } from './todo.model';

const todoRoutes = async (fastify: FastifyInstance) => {
  const todoController = new TodoController(fastify);

  // Get all todos
  fastify.get('/', todoController.getAllTodos.bind(todoController));

  // Get todo by id
  fastify.get('/:id', todoController.getTodoById.bind(todoController));

  // Create todo
  fastify.post<{ Body: TodoCreateInput }>(
    '/',
    {
      schema: {
        body: {
          type: 'object',
          required: ['title', 'description'],
          properties: {
            title: { type: 'string' },
            description: { type: 'string' },
            completed: { type: 'boolean' },
          },
        },
      },
    },
    todoController.createTodo.bind(todoController)
  );

  // Update todo
  fastify.patch<{ Params: { id: string }; Body: TodoUpdateInput }>(
    '/:id',
    {
      schema: {
        body: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            description: { type: 'string' },
            completed: { type: 'boolean' },
          },
        },
      },
    },
    todoController.updateTodo.bind(todoController)
  );

  // Delete todo
  fastify.delete('/:id', todoController.deleteTodo.bind(todoController));
};

export default (fastify: FastifyInstance) =>
  fastify.register(todoRoutes, { prefix: '/todos' });
