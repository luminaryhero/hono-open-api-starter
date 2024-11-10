import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi'
import { notFound, onError } from 'stoker/middlewares';


const app = new OpenAPIHono();

app.onError(onError);
app.notFound(notFound)

const route = createRoute({
  method: 'get',
  path: '/',
  responses: {
    200: {
      content: {
        'text/plain': {
          schema: z.string(),
        },
      },
      description: 'index Api',
    },
  },
})

app.openapi(route, (c) => {
  return c.text("Hello Hono!");
})

app.get('/error', (c) => {
  throw new Error('Oh No!');
})

app.doc('/doc',{
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'My API',
  },
})


export default app;
