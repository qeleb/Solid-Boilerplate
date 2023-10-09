import { createServer, type Registry, Response as MockResponse, type Server } from 'miragejs';
import type { AnyFactories, AnyModels } from 'miragejs/-types';

let testServer: Server<Registry<AnyModels, AnyFactories>> | undefined;

export const createMockServer = () => {
  if (testServer !== undefined) testServer.shutdown();
  return (testServer = createServer({
    environment: import.meta.env.MODE,
    routes() {
      this.namespace = '/api';

      this.get('/user', () => new MockResponse(200, {}, { name: 'John Doe', email: 'john.doe@example.com' }));
    },
  }));
};
