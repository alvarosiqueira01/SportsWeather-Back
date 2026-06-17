import { Request, Response }
from "express";

import { loginUser, registerUser }
from "../services/auth.service";

import { generateToken }
from "../utils/jwt";

export async function login(

 req:Request,

 res:Response

){

 const {

   email,

   password

 } = req.body;

 const user =
   await loginUser(
      email,
      password
   );

 const token =
   generateToken(
      user.id
   );

 return res.json({

   token,

   email:user.email

 });

}

export async function register(req: Request, res: Response) {
  try {
    const { email, username, password, sports, preferencesMode, customThresholds, favoriteLocations } = req.body;

    if (!email || !username || !password) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const user = await registerUser({
      email,
      username,
      password,
      sports,
      preferencesMode,
      customThresholds,
      favoriteLocations,
    });

    const token = generateToken(user.id);

    return res.status(201).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
}