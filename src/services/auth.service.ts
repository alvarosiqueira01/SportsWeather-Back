import bcrypt from "bcrypt";

import { UserRepository }
from "../repositories/user.repository";

const repo =
 new UserRepository();

export async function loginUser(

 email:string,

 password:string

){

 const user =
   await repo.findByEmail(
      email
   );

 if(!user){

   throw Error(
     "Invalid credentials"
   );

 }

 const valid =
   await bcrypt.compare(
      password,
      user.passwordHash
   );

 if(!valid){

   throw Error(
      "Invalid credentials"
   );

 }

 return user;

}


export async function registerUser(
  email: string,
  username: string,
  password: string
) {
  // 1. Verifica se o e-mail já está cadastrado (regra do índice unique)
  const existingEmail = await repo.findByEmail(email);
  if (existingEmail) {
    throw new Error("Email already in use");
  }

  // 2. Opcional: Verifica se o username já está cadastrado
  const existingUsername = await repo.findByUsername(username);
  if (existingUsername) {
    throw new Error("Username already in use");
  }

  // 3. Gera o hash da senha usando bcrypt (conforme seu planejamento de passwordHash)
  const saltRounds = 12; // Alinhado com o "$2b$12$...." do seu planejamento
  const passwordHash = await bcrypt.hash(password, saltRounds);

  // 4. Cria o payload do usuário baseado na modelagem do seu banco
  const newUser = await repo.create({
    email,
    username,
    passwordHash,
    role: "user", // Default padrão planejado
    status: "active",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastLogin: new Date()
  });

  return newUser;
}