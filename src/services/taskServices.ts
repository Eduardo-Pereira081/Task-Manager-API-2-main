import { randomUUID } from "node:crypto";
import { AppError } from "../errors/appError";
import { TaskDataTypes } from "../validations/taskSchema";
import { CreateTaskDataType, UpdateTaskDataType } from "../repositories/taskRepository";
import { PaginationDataTypes } from "../validations/paginationSchema";

export type TaskDataCreate = TaskDataTypes & { user_id: string };
export type UserTaskPagination = PaginationDataTypes & { userID: string };

export type TaskRepositoryTypes = {
  createTask(data: TaskDataCreate): Promise<CreateTaskDataType | undefined>;
  getTaskByID(id: string): Promise<Partial<CreateTaskDataType> | undefined>;

  getTasks(data: UserTaskPagination): Promise<CreateTaskDataType[] | undefined>;

  updateTask(data: UpdateTaskDataType): Promise<UpdateTaskDataType | undefined>;
  deleteTaskByID(id: string): Promise<{ id: string } | undefined>;
};

export const taskServices = {
  async create(
    { title, description, date, status, user_id }: TaskDataCreate,
    repository: TaskRepositoryTypes
  ) {
    try {
      if (new Date(date) < new Date()) {
        throw new AppError("date cannot be before the current time", 400);
      }

      const task = {
        id: randomUUID(),
        title,
        description,
        date,
        status: status || "pending",
        user_id,
      };

      const taskCreated = await repository.createTask(task);

      return taskCreated;
    } catch (error) {
      throw error;
    }
  },

  async read(
    { userID, limit, offset, filter }: UserTaskPagination,
    repository: TaskRepositoryTypes
  ) {
    try {
      if (!limit || !offset || !filter) {
        throw new AppError("please inform limit, offset and filter", 404);
      }

      const userTasks = await repository.getTasks({ userID, limit, offset, filter });

      return userTasks;
    } catch (error) {
      throw error;
    }
  },

  async update(
    id: string,
    { title, description, date, status, user_id }: TaskDataCreate,
    repository: TaskRepositoryTypes
  ) {
    try {
      const task = await repository.getTaskByID(id);
      if (!task) throw new AppError("task not found", 404);

      if (task.user_id != user_id) {
        throw new AppError("user not authorized to update task", 401);
      }

      const taskUpdated = await repository.updateTask({
        id,
        title,
        description,
        date,
        status: status || "pending",
        user_id,
        update_at: new Date(),
      });

      return taskUpdated;
    } catch (error) {
      throw error;
    }
  },

  async delete(id: string, user_id: string, repository: TaskRepositoryTypes) {
    try {
      const task = await repository.getTaskByID(id);
      if (!task) throw new AppError("task not found", 404);

      if (task.user_id != user_id) {
        throw new AppError("user not authorized to delete task", 401);
      }

      const taskDeleted = await repository.deleteTaskByID(id);

      return taskDeleted;
    } catch (error) {
      throw error;
    }
  },
};
