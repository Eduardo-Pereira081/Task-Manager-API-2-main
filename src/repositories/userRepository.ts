import { sqliteConnection } from "../databases";
import { UserDataTypes } from "../validations/userSchema";

export type CreateUserDataType = UserDataTypes & { id: string };

export const userRepository = {
  async create({ id, name, email, password }: CreateUserDataType) {
    try {
      const db = await sqliteConnection();

      const query = `
      INSERT INTO users (id, name, email, password)
      VALUES (?, ?, ?, ?)
    `;

      await db.run(query, [id, name, email, password]);

      return { id, name, email, password };
    } catch (error) {
      throw error;
    }
  },

  async getUserByEmail(email: string) {
    try {
      const db = await sqliteConnection();

      const query = `SELECT * FROM users WHERE email = ?`;

      const user = await db.get(query, email);

      return user;
    } catch (error) {
      throw error;
    }
  },

  async getUserByID(id: string) {
    try {
      const db = await sqliteConnection();

      const query = `SELECT * FROM users WHERE id = ?`;

      const user = await db.get(query, id);

      return user;
    } catch (error) {
      throw error;
    }
  },
};
