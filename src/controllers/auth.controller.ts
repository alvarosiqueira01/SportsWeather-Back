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
    const { email, username, password } = req.body;

    // Validação básica de campos obrigatórios
    if (!email || !username || !password) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Executa a criação no banco de dados
    const user = await registerUser(email, username, password);

    // Gera o token de acesso (assim o usuário já loga direto após registrar)
    const token = generateToken(user.id);

    return res.status(201).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role
      }
    });
  } catch (error: any) {
    // Tratamento de erros de negócio (ex: usuário já existe)
    return res.status(400).json({ error: error.message });
  }
}