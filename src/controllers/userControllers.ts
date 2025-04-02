import { NextFunction, Request, Response } from "express";
import { userSchema } from "../validations/userSchema";
import { userServices } from "../services/userServices";
import { userRepository } from "../repositories/userRepository";
import { UUIDSchema } from "../validations/UUIDSchema";

export const userControllers = {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, password } = userSchema.parse(req.body);

      const userCreated = await userServices.create(
        { name, email, password },
        userRepository
      );

      // SOLID

      res.status(201).json(userCreated);
    } catch (error) {
      next(error);
    }
  },

  async read(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = UUIDSchema().parse({ id: req.userID });

      const user = await userServices.read(id, userRepository);

      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  },
};
