import { FastifyInstance } from 'fastify';
import { createClient } from '@supabase/supabase-js';

export const configureDatabase = async (fastify: FastifyInstance) => {
  const supabaseUrl = process.env.SUPABASE_URL || 'your-supabase-url';
  const supabaseKey = process.env.SUPABASE_KEY || 'your-supabase-key';

  const supabase = createClient(supabaseUrl, supabaseKey);

  // Add supabase client to fastify instance
  fastify.decorate('supabase', supabase);
};
