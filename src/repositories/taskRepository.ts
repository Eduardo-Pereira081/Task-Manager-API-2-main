import { sqliteConnection } from "../databases";
import { AppError } from "../errors/appError";
import { TaskDataCreate, UserTaskPagination } from "../services/taskServices";

export type CreateTaskDataType = TaskDataCreate & { id: string };
export type UpdateTaskDataType = CreateTaskDataType & { update_at: Date };

export const taskRepository = {
  async createTask({
    id,
    title,
    description,
    date,
    status,
    user_id,
  }: CreateTaskDataType) {
    try {
      const db = await sqliteConnection();

      const query = `
      INSERT INTO tasks (id, title, description, date, status, user_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

      await db.run(query, [id, title, description, date, status, user_id]);

      return { id, title, description, date, status, user_id };
    } catch (error) {
      throw error;
    }
  },

  async getTaskByID(id: string) {
    try {
      const db = await sqliteConnection();

      const query = `SELECT * FROM tasks WHERE id = ?`;

      const task = await db.get(query, id);

      return task;
    } catch (error) {
      throw error;
    }
  },

  async getTasks({ userID, limit, offset, filter }: UserTaskPagination) {
    try {
      const db = await sqliteConnection();
      let querySQL = "";
      let tasks = [];

      switch (filter) {
        case "all":
          querySQL = `
          SELECT * FROM tasks
          WHERE user_id = ?
          ORDER BY created_at DESC
          LIMIT ? OFFSET ?;
        `;

          tasks = await db.all(querySQL, [userID, limit, offset]);

          break;

        case "completed":
          querySQL = `
          SELECT * FROM tasks
          WHERE user_id = ? AND status = 'completed'
          ORDER BY created_at DESC
          LIMIT ? OFFSET ?;
        `;

          tasks = await db.all(querySQL, [userID, limit, offset]);

          break;

        case "pending":
          querySQL = `
          SELECT * FROM tasks
          WHERE user_id = ? AND status = 'pending' AND date >= CURRENT_DATE
          ORDER BY created_at DESC
          LIMIT ? OFFSET ?;
        `;

          tasks = await db.all(querySQL, [userID, limit, offset]);

          break;

        case "late":
          querySQL = `
          SELECT * FROM tasks
          WHERE user_id = ? AND status = 'pending' AND date < CURRENT_DATE
          ORDER BY created_at DESC
          LIMIT ? OFFSET ?;
        `;

          tasks = await db.all(querySQL, [userID, limit, offset]);

          break;

        default:
          throw new AppError("invalid filter", 400);
      }

      return tasks;
    } catch (error) {
      throw error;
    }
  },

  async updateTask({
    id,
    title,
    description,
    date,
    status,
    user_id,
    update_at,
  }: UpdateTaskDataType) {
    try {
      const db = await sqliteConnection();

      const query = `
      UPDATE tasks
      SET title = ?, description = ?, date = ?, status = ?, update_at = ?
      WHERE id = ? AND user_id = ?
    `;

      await db.run(query, [title, description, date, status, update_at, id, user_id]);

      return { id, title, description, date, status, user_id, update_at };
    } catch (error) {
      throw error;
    }
  },

  async deleteTaskByID(id: string) {
    try {
      const db = await sqliteConnection();

      const query = `DELETE FROM tasks WHERE id = ?`;
      await db.run(query, id);

      return { id };
    } catch (error) {
      throw error;
    }
  },
};
