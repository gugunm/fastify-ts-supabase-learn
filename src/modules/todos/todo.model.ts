export interface Todo {
  id?: number;
  title: string;
  description: string;
  completed: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export interface TodoCreateInput {
  title: string;
  description: string;
  completed?: boolean;
}

export interface TodoUpdateInput {
  title?: string;
  description?: string;
  completed?: boolean;
}
