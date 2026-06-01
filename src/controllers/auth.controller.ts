import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { generateToken }
from "../utils/jwt";

export async function login(
  req: Request,
  res: Response
) {

  const token =
    generateToken("mock-user");

  res.json({
    token
  });
}