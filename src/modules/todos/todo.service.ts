import { FastifyInstance } from 'fastify';
import { Todo, TodoCreateInput, TodoUpdateInput } from './todo.model';

export class TodoService {
  constructor(private readonly fastify: FastifyInstance) {}

  async findAll(): Promise<Todo[]> {
    const { data, error } = await this.fastify.supabase
      .from('todos')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Todo[];
  }

  async findById(id: number): Promise<Todo | null> {
    const { data, error } = await this.fastify.supabase
      .from('todos')
      .select('*')
      .eq('id', id)
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
      .select()
      .single();

    if (error) throw error;
    return updatedTodo as Todo;
  }

  async delete(id: number): Promise<boolean> {
    const { error } = await this.fastify.supabase
      .from('todos')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }
}
