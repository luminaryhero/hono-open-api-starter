import type { AppRouteHandler } from "@/lib/types";
import type { TaskCreateRoute, TaskDeleteRoute, TaskListRoute, TaskUpdateRoute } from "@/routers/task.route";

export const taskListHandler: AppRouteHandler<TaskListRoute> = async (c) => {
  return c.json([
    {
      name: "Task 1",
      done: true,
    },
    {
      name: "Task 2",
      done: true,
    },
  ]);
};

export const taskCreateHandler: AppRouteHandler<TaskCreateRoute> = async (c) => {
  return c.json({
    id: 3,
    name: "Task 3",
    done: true,
  });
};

export const taskUpdateHandler: AppRouteHandler<TaskUpdateRoute> = async (c) => {
  const { id } = await c.req.valid("param");
  return c.json({
    id,
    name: "Task name updated",
    done: true,
  });
};

export const taskDeleteHandler: AppRouteHandler<TaskDeleteRoute> = async (c) => {
  const { id } = await c.req.valid("param");
  return c.json({
    message: `Task deleted,id=${id}`,
  });
};
