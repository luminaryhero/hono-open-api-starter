import type { OpenAPIHono } from "@hono/zod-openapi";

import { apiReference } from "@scalar/hono-api-reference";

/**
 * Configures the OpenAPI documentation for the provided Hono app instance.
 *
 * Sets up the OpenAPI document at the "/doc" endpoint with basic information
 * such as version and title. Additionally, it registers a route to serve the
 * API reference page at the "/reference" endpoint with a specified theme,
 * layout, and client settings.
 *
 * @param app - The Hono app instance to configure OpenAPI documentation for.
 */
export function configureOpenAPI(app: OpenAPIHono) {
  app.doc("/doc", {
    openapi: "3.0.0",
    info: {
      version: "1.0.0",
      title: "My Hono API",
    },
  });

  app.get(
    "/reference",
    apiReference({
      theme: "kepler",
      layout: "modern",
      spec: {
        url: "/doc",
      },
      hideDownloadButton: true,
      defaultHttpClient: {
        targetKey: "shell",
        clientKey: "curl",
      },
      servers: [
        {
          url: "http://localhost:3000/",
        },
      ],
    }),
  );
}
