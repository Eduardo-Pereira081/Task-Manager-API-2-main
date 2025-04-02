import { expect, test, describe } from "vitest";
import { userRepositoryInMemory } from "../repositories/userRepositoryInMemory";
import { userServices } from "../services/userServices";

describe("test create user functions", async () => {
  const user = {
    name: "João",
    email: "user@email.com",
    password: "123",
  };

  test("should create user", async () => {
    const userCreated = await userServices.create(user, userRepositoryInMemory);

    expect(userCreated).toBeDefined();
    expect(userCreated).toHaveProperty("id");
    expect(userCreated?.email).toEqual(user.email);
  });

  test("should not create user with same email", async () => {
    try {
      await userServices.create(user, userRepositoryInMemory);
    } catch (error: any) {
      expect(error.message).toBe("email already exists");
    }
  });
});
