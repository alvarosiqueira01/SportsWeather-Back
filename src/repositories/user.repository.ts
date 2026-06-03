import User
  from "../models/User";

export class UserRepository {

  async create(data: any) {

    return User.create(data);

  }

  async findByEmail(email: string) {

    return User.findOne({ email });

  }

  async findByUsername(username: string) {
    return User.findOne({ username });
  }

}