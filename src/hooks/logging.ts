import { FastifyInstance } from 'fastify';

export default function loggingHook(fastify: FastifyInstance) {
  fastify.addHook('onRequest', async (request, reply) => {
    fastify.log.info(`Client request: ${request.method} ${request.url}`);
  });
}
