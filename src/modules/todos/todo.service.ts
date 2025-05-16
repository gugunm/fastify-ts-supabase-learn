import { FastifyInstance } from 'fastify';
import { Todo, TodoCreateInput, TodoUpdateInput } from './todo.model';

export class TodoService {
  constructor(private readonly fastify: FastifyInstance) {}

  async findAll(
    limit: number = 10,
    offset: number = 0
  ): Promise<{ todos: Todo[]; total: number }> {
    const { data: todos, error } = await this.fastify.supabase
      .from('todos')
      .select('*')
      .eq('deleted', false)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    const { count } = await this.fastify.supabase
      .from('todos')
      .select('*', { count: 'exact', head: true })
      .eq('deleted', false);

    return { todos: todos as Todo[], total: count || 0 };
  }

  async findById(id: number): Promise<Todo | null> {
    const { data, error } = await this.fastify.supabase
      .from('todos')
      .select('*')
      .eq('id', id)
      .eq('deleted', false)
      .single();

    if (error) throw error;
    return data as Todo;
  }

  async create(data: TodoCreateInput): Promise<Todo> {
    const { data: newTodo, error } = await this.fastify.supabase
      .from('todos')
      .insert([{ ...data, completed: data.completed || false }])
      .select()
      .single();

    if (error) throw error;
    return newTodo as Todo;
  }

  async update(id: number, data: TodoUpdateInput): Promise<Todo | null> {
    const { data: updatedTodo, error } = await this.fastify.supabase
      .from('todos')
      .update(data)
      .eq('id', id)
      .eq('deleted', false)
      .select()
      .single();

    if (error) throw error;
    return updatedTodo as Todo;
  }

  async delete(id: number): Promise<boolean> {
    const { error } = await this.fastify.supabase
      .from('todos')
      .update({ deleted: true })
      .eq('id', id);

    if (error) throw error;
    return true;
  }
}
